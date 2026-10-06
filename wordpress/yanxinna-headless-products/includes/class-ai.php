<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 用 WordPress 7 自带的 AI Client 把中文产品信息写成五语文案。
 *
 * 两条接口路，二选一，优先第一条：
 *  1. 后台「批量导入」页里填的 OpenAI 兼容接口（中转站、DeepSeek、智谱等都是这种），直接 wp_remote_post；
 *  2. WordPress 7 的「设置 → Connectors」里配的官方供应商（Anthropic / OpenAI / Google），走 AI Client。
 * 两个入口共用 generate()：产品编辑页的「用中文生成五种语言文案」按钮，和后台「批量导入」页。
 * 文案规范在 prompts/translate-zh-to-five.txt，改口吻改那个文件。
 */
final class YANXINNA_Headless_AI {
	const LOCALES          = YANXINNA_Headless_Importer::LOCALES;
	const MODEL_PREFERENCE = array( 'claude-opus-5-5', 'claude-sonnet-5-5' );
	const GENERATE_FLAG    = 'yx_generate';
	const NOTICE_KEY       = 'yx_generate_notice_';
	const OPTION_BASE_URL  = 'yx_ai_base_url';
	const OPTION_API_KEY   = 'yx_ai_api_key';
	const OPTION_MODEL     = 'yx_ai_model';

	/** 编辑页点按钮生成出来的文案，在保存流程里从 wp_insert_post_data 带到 acf/save_post。 */
	private static $pending_copy = null;

	public static function register() {
		add_action( 'acf/validate_save_post', array( __CLASS__, 'skip_validation_when_generating' ), 999 );
		add_filter( 'wp_insert_post_data', array( __CLASS__, 'generate_before_save' ), 10, 2 );
		add_action( 'acf/save_post', array( __CLASS__, 'apply_after_save' ), 20 );
		add_action( 'admin_notices', array( __CLASS__, 'print_notice' ) );
	}

	/** 后台填的第三方接口；地址或 key 有一个没填就当没配。 */
	public static function custom_endpoint() {
		$base = rtrim( trim( (string) get_option( self::OPTION_BASE_URL ) ), '/' );
		$base = preg_replace( '#/chat/completions$#', '', $base );
		$key  = trim( (string) get_option( self::OPTION_API_KEY ) );
		if ( ! $base || ! $key ) {
			return null;
		}
		return array(
			'base'  => $base,
			'key'   => $key,
			'model' => trim( (string) get_option( self::OPTION_MODEL ) ),
		);
	}

	/** 一句话说明当前走哪条路，给后台页面显示。 */
	public static function backend_label() {
		$endpoint = self::custom_endpoint();
		if ( $endpoint ) {
			return '第三方接口 ' . $endpoint['base'] . '，模型 ' . ( $endpoint['model'] ?: '（未填）' );
		}
		return self::connectors_available() ? 'WordPress「设置 → Connectors」里配的供应商' : '未配置';
	}

	/** 站点有没有配好能生成文本的 AI 接口。 */
	public static function is_available() {
		return (bool) self::custom_endpoint() || self::connectors_available();
	}

	private static function connectors_available() {
		if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
			return false;
		}
		try {
			return (bool) wp_ai_client_prompt( 'ping' )->is_supported_for_text_generation();
		} catch ( Throwable $error ) {
			return false;
		}
	}

	/**
	 * @param array $source product_number, name_zh, category, subcategory, sizes[], colors_zh[],
	 *                      fabric_zh, care_zh, compression_level, benefits_zh[]，可选 short_zh / description_zh / badge_zh。
	 * @return array|WP_Error array( 'translations' => { locale => {...} }, 'colors' => [ { locale => 色名 } ] )
	 */
	public static function generate( array $source ) {
		$endpoint = self::custom_endpoint();
		if ( ! $endpoint && ! function_exists( 'wp_ai_client_prompt' ) ) {
			return new WP_Error( 'yx_ai_missing', '没有可用的 AI 接口：在「批量导入」页填第三方接口，或升级 WordPress 7 配 Connectors。' );
		}
		$system = self::system_prompt();
		if ( is_wp_error( $system ) ) {
			return $system;
		}

		$prompt      = "产品信息（JSON）：\n" . wp_json_encode( $source, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
		$color_count = count( $source['colors_zh'] ?? array() );
		$last_error  = null;

		for ( $attempt = 1; $attempt <= 2; $attempt++ ) {
			$json = $endpoint
				? self::call_openai_compatible( $endpoint, $system, $prompt, 1 === $attempt )
				: wp_ai_client_prompt( $prompt )
					->using_system_instruction( $system )
					->using_model_preference( ...self::MODEL_PREFERENCE )
					->using_max_tokens( 8000 )
					->as_json_response( self::schema() )
					->generate_text();

			if ( is_wp_error( $json ) ) {
				$last_error = $json;
				continue;
			}

			$copy = self::validate( json_decode( (string) $json, true ), $color_count );
			if ( is_wp_error( $copy ) ) {
				$last_error = $copy;
				continue;
			}

			return $copy;
		}

		return $last_error ? $last_error : new WP_Error( 'yx_ai_failed', '生成失败。' );
	}

	/**
	 * OpenAI 兼容的 /chat/completions。第一次带 response_format=json_object（OpenAI、DeepSeek 等支持，
	 * 回得更稳）；有的中转站不认这个参数会报 400，第二次就不带，靠提示词 + 校验兜底。
	 */
	private static function call_openai_compatible( array $endpoint, $system, $prompt, $strict_json ) {
		if ( ! $endpoint['model'] ) {
			return new WP_Error( 'yx_ai_model', '第三方接口还没填模型名，到「批量导入」页的接口设置里补上。' );
		}
		$body = array(
			'model'       => $endpoint['model'],
			'temperature' => 0.3,
			'max_tokens'  => 8000,
			'messages'    => array(
				array(
					'role'    => 'system',
					'content' => $system,
				),
				array(
					'role'    => 'user',
					'content' => $prompt . "\n\n只输出一个 JSON 对象，结构必须是：\n" . wp_json_encode( self::schema(), JSON_UNESCAPED_UNICODE ),
				),
			),
		);
		if ( $strict_json ) {
			$body['response_format'] = array( 'type' => 'json_object' );
		}

		$response = wp_remote_post(
			$endpoint['base'] . '/chat/completions',
			array(
				'timeout' => 180,
				'headers' => array(
					'Authorization' => 'Bearer ' . $endpoint['key'],
					'Content-Type'  => 'application/json',
				),
				'body'    => wp_json_encode( $body, JSON_UNESCAPED_UNICODE ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$raw  = (string) wp_remote_retrieve_body( $response );
		if ( 200 !== $code ) {
			return new WP_Error( 'yx_ai_http', sprintf( '接口返回 %d：%s', $code, mb_substr( $raw, 0, 300 ) ) );
		}
		$data    = json_decode( $raw, true );
		$content = trim( (string) ( $data['choices'][0]['message']['content'] ?? '' ) );
		if ( '' === $content ) {
			return new WP_Error( 'yx_ai_empty', '接口没有返回内容：' . mb_substr( $raw, 0, 300 ) );
		}

		// 去掉 ```json 围栏；有的模型会在 JSON 前后加说明，只取第一个 { 到最后一个 }。
		$content = preg_replace( '/^```(?:json)?\s*|\s*```$/i', '', $content );
		$start   = strpos( $content, '{' );
		$end     = strrpos( $content, '}' );
		return ( false !== $start && false !== $end && $end > $start ) ? substr( $content, $start, $end - $start + 1 ) : $content;
	}

	private static function system_prompt() {
		$path   = YANXINNA_HEADLESS_PRODUCTS_PATH . 'prompts/translate-zh-to-five.txt';
		$prompt = is_readable( $path ) ? file_get_contents( $path ) : '';
		return $prompt ? $prompt : new WP_Error( 'yx_ai_prompt', '缺少文案规范文件 prompts/translate-zh-to-five.txt。' );
	}

	private static function schema() {
		$string    = array( 'type' => 'string' );
		$localized = array(
			'type'                 => 'object',
			'additionalProperties' => false,
			'required'             => array( 'name', 'short_description', 'description', 'badge', 'fabric', 'care', 'benefits', 'seo_title', 'seo_description' ),
			'properties'           => array(
				'name'              => $string,
				'short_description' => $string,
				'description'       => $string,
				'badge'             => $string,
				'fabric'            => $string,
				'care'              => $string,
				'benefits'          => array(
					'type'  => 'array',
					'items' => $string,
				),
				'seo_title'         => $string,
				'seo_description'   => $string,
			),
		);
		$per_locale = function ( $schema ) {
			return array(
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => self::LOCALES,
				'properties'           => array_fill_keys( self::LOCALES, $schema ),
			);
		};

		return array(
			'type'                 => 'object',
			'additionalProperties' => false,
			'required'             => array( 'translations', 'colors' ),
			'properties'           => array(
				'translations' => $per_locale( $localized ),
				'colors'       => array(
					'type'  => 'array',
					'items' => $per_locale( $string ),
				),
			),
		);
	}

	private static function validate( $data, $color_count ) {
		if ( ! is_array( $data ) || empty( $data['translations'] ) || ! isset( $data['colors'] ) ) {
			return new WP_Error( 'yx_ai_shape', 'AI 返回的不是预期的 JSON 结构。' );
		}

		$translations = array();
		foreach ( self::LOCALES as $locale ) {
			$t = $data['translations'][ $locale ] ?? null;
			if ( ! is_array( $t ) ) {
				return new WP_Error( 'yx_ai_locale', "缺少 {$locale} 的文案。" );
			}
			foreach ( array( 'name', 'short_description', 'description', 'fabric', 'care', 'seo_title', 'seo_description' ) as $key ) {
				if ( '' === trim( (string) ( $t[ $key ] ?? '' ) ) ) {
					return new WP_Error( 'yx_ai_field', "{$locale} 的 {$key} 是空的。" );
				}
			}
			$benefits = array_values( array_filter( array_map( 'trim', (array) ( $t['benefits'] ?? array() ) ) ) );
			if ( ! $benefits ) {
				return new WP_Error( 'yx_ai_benefits', "{$locale} 的卖点是空的。" );
			}
			$translations[ $locale ] = array(
				'name'              => trim( $t['name'] ),
				'short_description' => trim( $t['short_description'] ),
				'description'       => trim( $t['description'] ),
				'badge'             => trim( (string) ( $t['badge'] ?? '' ) ),
				'fabric'            => trim( $t['fabric'] ),
				'care'              => trim( $t['care'] ),
				'benefits'          => $benefits,
				'seo_title'         => trim( $t['seo_title'] ),
				'seo_description'   => mb_substr( trim( $t['seo_description'] ), 0, 320 ),
			);
		}

		$colors = array();
		foreach ( (array) $data['colors'] as $names ) {
			$row = array();
			foreach ( self::LOCALES as $locale ) {
				$row[ $locale ] = trim( (string) ( $names[ $locale ] ?? '' ) );
				if ( '' === $row[ $locale ] ) {
					return new WP_Error( 'yx_ai_color', "颜色名缺少 {$locale}。" );
				}
			}
			$colors[] = $row;
		}
		if ( count( $colors ) !== $color_count ) {
			return new WP_Error( 'yx_ai_color_count', sprintf( '颜色数量不符：输入 %d 个，返回 %d 个。', $color_count, count( $colors ) ) );
		}

		return array(
			'translations' => $translations,
			'colors'       => $colors,
		);
	}

	// ---------- 产品编辑页的「生成」按钮 ----------

	private static function generating() {
		return isset( $_POST[ self::GENERATE_FLAG ], $_POST['post_type'] )
			&& '1' === $_POST[ self::GENERATE_FLAG ]
			&& YANXINNA_Headless_Content::POST_TYPE === $_POST['post_type'];
	}

	/** 点「生成」时五语字段还是空的，先放过 ACF 的必填校验；正式发布那次照常校验。 */
	public static function skip_validation_when_generating() {
		if ( self::generating() && function_exists( 'acf_reset_validation_errors' ) ) {
			acf_reset_validation_errors();
		}
	}

	/** 保存前先生成，顺便把网址改成英文名；文案等 ACF 存完表单值后再写（见 apply_after_save）。 */
	public static function generate_before_save( $data, $postarr ) {
		self::$pending_copy = null;
		if ( ! self::generating() || YANXINNA_Headless_Content::POST_TYPE !== ( $data['post_type'] ?? '' ) ) {
			return $data;
		}
		$post_id = (int) ( $postarr['ID'] ?? 0 );
		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			return $data;
		}

		$source = self::source_from_request();
		if ( is_wp_error( $source ) ) {
			self::set_notice( 'error', $source->get_error_message() );
			return $data;
		}

		set_time_limit( 300 );
		$copy = self::generate( $source );
		if ( is_wp_error( $copy ) ) {
			self::set_notice( 'error', '生成失败：' . $copy->get_error_message() );
			return $data;
		}

		self::$pending_copy = $copy;
		if ( 'publish' !== ( $data['post_status'] ?? '' ) ) {
			$slug = sanitize_title( $copy['translations']['en-US']['name'] );
			if ( $slug ) {
				$data['post_name'] = wp_unique_post_slug( $slug, $post_id, $data['post_status'], $data['post_type'], (int) ( $data['post_parent'] ?? 0 ) );
			}
		}
		return $data;
	}

	public static function apply_after_save( $post_id ) {
		if ( ! self::$pending_copy || ! is_numeric( $post_id ) ) {
			return;
		}
		$copy               = self::$pending_copy;
		self::$pending_copy = null;

		update_field( 'field_yx_v1_translations', YANXINNA_Headless_Importer::translations_rows( $copy['translations'] ), $post_id );

		$rows = get_field( 'colors', $post_id );
		if ( is_array( $rows ) ) {
			foreach ( $rows as $index => $row ) {
				if ( empty( $copy['colors'][ $index ] ) ) {
					continue;
				}
				$rows[ $index ]['image']       = is_array( $row['image'] ) ? (int) $row['image']['ID'] : (int) $row['image'];
				$rows[ $index ]['hover_image'] = is_array( $row['hover_image'] ) ? (int) $row['hover_image']['ID'] : (int) $row['hover_image'];
				$rows[ $index ]['names']       = array_merge( (array) $row['names'], $copy['colors'][ $index ] );
			}
			update_field( 'field_yx_v1_colors', array_values( $rows ), $post_id );
		}

		self::set_notice( 'success', '五种语言的文案和颜色名已生成并填入下方。检查一遍没问题，再点「发布」。' );
	}

	/** 从提交的表单里读中文原文和每个颜色的中文色名（这时 ACF 还没存库）。 */
	private static function source_from_request() {
		$acf   = isset( $_POST['acf'] ) && is_array( $_POST['acf'] ) ? wp_unslash( $_POST['acf'] ) : array();
		$field = function ( $name ) use ( $acf ) {
			return trim( (string) ( $acf[ 'field_yx_v1_' . $name ] ?? '' ) );
		};
		$lines = function ( $text ) {
			return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n|\|/', $text ) ) ) );
		};

		$name_zh = $field( 'zh_name' );
		if ( '' === $name_zh ) {
			return new WP_Error( 'yx_zh_name', '先填「中文原文」里的中文名称，再点生成。' );
		}
		if ( '' === $field( 'zh_fabric' ) ) {
			return new WP_Error( 'yx_zh_fabric', '先填「中文原文」里的面料成分，再点生成。' );
		}

		$colors_zh = array();
		foreach ( (array) ( $acf['field_yx_v1_colors'] ?? array() ) as $row_key => $row ) {
			if ( 'acfcloneindex' === $row_key || ! is_array( $row ) ) {
				continue;
			}
			$zh = trim( (string) ( $row['field_yx_v1_color_names']['field_yx_v1_color_names_zh'] ?? '' ) );
			if ( '' === $zh ) {
				return new WP_Error( 'yx_zh_color', '每个颜色都要填「中文色名」，再点生成。' );
			}
			$colors_zh[] = $zh;
		}

		$sizes = array();
		foreach ( (array) ( $acf['field_yx_v1_sizes'] ?? array() ) as $row_key => $row ) {
			if ( 'acfcloneindex' !== $row_key && is_array( $row ) && '' !== trim( (string) ( $row['field_yx_v1_size_value'] ?? '' ) ) ) {
				$sizes[] = trim( $row['field_yx_v1_size_value'] );
			}
		}

		$terms = array();
		$tax   = YANXINNA_Headless_Content::TAXONOMY;
		if ( isset( $_POST['tax_input'][ $tax ] ) ) {
			foreach ( array_filter( array_map( 'absint', (array) wp_unslash( $_POST['tax_input'][ $tax ] ) ) ) as $term_id ) {
				$term = get_term( $term_id, $tax );
				if ( $term && ! is_wp_error( $term ) ) {
					$terms[] = $term->slug;
				}
			}
		}

		return array(
			'product_number'    => $field( 'product_number' ),
			'name_zh'           => $name_zh,
			'short_zh'          => $field( 'zh_short' ),
			'description_zh'    => $field( 'zh_description' ),
			'badge_zh'          => $field( 'zh_badge' ),
			'category'          => implode( ', ', $terms ),
			'subcategory'       => '',
			'sizes'             => $sizes,
			'colors_zh'         => $colors_zh,
			'fabric_zh'         => $field( 'zh_fabric' ),
			'care_zh'           => $field( 'zh_care' ) ?: '冷水手洗 平铺晾干',
			'compression_level' => $field( 'compression_level' ) ?: 'Medium',
			'benefits_zh'       => $lines( $field( 'zh_benefits' ) ),
		);
	}

	private static function set_notice( $type, $text ) {
		set_transient( self::NOTICE_KEY . get_current_user_id(), compact( 'type', 'text' ), 120 );
	}

	public static function print_notice() {
		$notice = get_transient( self::NOTICE_KEY . get_current_user_id() );
		if ( ! $notice ) {
			return;
		}
		delete_transient( self::NOTICE_KEY . get_current_user_id() );
		printf(
			'<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
			'success' === $notice['type'] ? 'success' : 'error',
			esc_html( $notice['text'] )
		);
	}
}
