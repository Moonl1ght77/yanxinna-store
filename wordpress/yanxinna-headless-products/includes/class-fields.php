<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Fields {
	const GROUP_KEY = 'group_yanxinna_products_v1';

	/** 站点默认语言，只有这一种语言的文案是必填，其余语言留空时由 API 回退。 */
	const DEFAULT_LOCALE = 'ru-RU';

	/**
	 * 界面语言标签用中文，商家看得懂；数组的键（locale code）是数据结构的一部分，不能改。
	 */
	private static $locales = array(
		'ru-RU' => '俄语',
		'en-US' => '英语（美国）',
		'en-GB' => '英语（英国）',
		'fr-FR' => '法语',
		'de-DE' => '德语',
	);

	public static function register() {
		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'                   => self::GROUP_KEY,
				'title'                 => '产品信息',
				'fields'                => self::fields(),
				'location'              => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => YANXINNA_Headless_Content::POST_TYPE,
						),
					),
				),
				'menu_order'            => 0,
				'position'              => 'normal',
				'style'                 => 'default',
				'label_placement'       => 'top',
				'instruction_placement' => 'label',
				'active'                => true,
				'show_in_rest'          => false,
			)
		);
	}

	public static function validate_product_number( $valid, $value, $field, $input ) {
		unset( $field, $input );

		if ( true !== $valid || ! $value ) {
			return $valid;
		}

		$post_id = isset( $_POST['post_ID'] ) ? absint( wp_unslash( $_POST['post_ID'] ) ) : 0;
		$matches = get_posts(
			array(
				'post_type'      => YANXINNA_Headless_Content::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'post__not_in'   => $post_id ? array( $post_id ) : array(),
				'meta_query'     => array(
					array(
						'key'     => 'product_number',
						'value'   => sanitize_text_field( $value ),
						'compare' => '=',
					),
				),
				'fields'         => 'ids',
			)
		);

		return $matches
			? '产品编号不能重复，这个编号已经被其他产品用了。'
			: $valid;
	}

	/**
	 * 标题、主图、分类这三项不归 ACF 管，缺了不会有任何提示，但产品会被公开 API 静默剔除
	 * （见 class-rest.php 的 $missing 判断）——表现是后台显示已发布、前台却看不到。
	 * 这里在保存时直接拦下来并说清楚缺什么。
	 *
	 * 只在后台表单提交时生效；WP-CLI 批量导入没有 $_POST，不受影响。
	 */
	public static function validate_required_post_parts() {
		if ( ! function_exists( 'acf_add_validation_error' ) ) {
			return;
		}

		$post_type = isset( $_POST['post_type'] ) ? sanitize_key( wp_unslash( $_POST['post_type'] ) ) : '';
		if ( YANXINNA_Headless_Content::POST_TYPE !== $post_type ) {
			return;
		}

		$title = isset( $_POST['post_title'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['post_title'] ) ) ) : '';
		if ( '' === $title ) {
			acf_add_validation_error( '', '请填写产品标题（页面最上方那一行）。标题决定产品网址。' );
		}

		$thumbnail_id = isset( $_POST['_thumbnail_id'] ) ? (int) wp_unslash( $_POST['_thumbnail_id'] ) : 0;
		if ( $thumbnail_id <= 0 ) {
			acf_add_validation_error( '', '请设置产品主图：页面右侧「特色图片」→ 设置特色图片。没有主图的产品不会出现在网站上。' );
		}

		$taxonomy = YANXINNA_Headless_Content::TAXONOMY;
		$terms    = array();
		if ( isset( $_POST['tax_input'][ $taxonomy ] ) ) {
			$terms = array_filter( array_map( 'absint', (array) wp_unslash( $_POST['tax_input'][ $taxonomy ] ) ) );
		}
		if ( ! $terms ) {
			acf_add_validation_error( '', '请在页面右侧「产品分类」里勾选至少一个分类。没有分类的产品不会出现在网站上。' );
		}
	}

	private static function fields() {
		return array(
			self::text_field( 'product_number', '产品编号', true, null, '全站唯一，例如 YX-006。重复会保存失败。' ),
			self::image_field( 'hover_image', '悬停图', false, null, '鼠标放到产品上时切换显示的图，一般用模特上身图。' ),
			array(
				'key'           => 'field_yx_v1_gallery',
				'label'         => '详情页图集',
				'name'          => 'gallery',
				'type'          => 'gallery',
				'instructions'  => '产品详情页可以左右翻的那组图，建议 3–5 张。',
				'return_format' => 'array',
				'preview_size'  => 'medium',
				'library'       => 'all',
			),
			self::sizes_field(),
			self::colors_field(),
			self::parameters_field(),
			self::attachments_field(),
			array(
				'key'           => 'field_yx_v1_compression_level',
				'label'         => '压缩等级',
				'name'          => 'compression_level',
				'type'          => 'select',
				'instructions'  => '不确定就选「中等」。',
				'choices'       => array(
					'Light'  => '轻（Light）',
					'Medium' => '中等（Medium）',
					'Firm'   => '强（Firm）',
				),
				'allow_null'    => true,
				'return_format' => 'value',
				'ui'            => true,
			),
			self::boolean_field( 'featured', '首页推荐', '打开后这个产品会出现在首页推荐区。' ),
			self::boolean_field( 'best_seller', '热销标记', '打开后产品图上会显示热销角标。' ),
			array(
				'key'           => 'field_yx_v1_sort_order',
				'label'         => '排序',
				'name'          => 'sort_order',
				'type'          => 'number',
				'instructions'  => '数字越小越靠前，不填按 0 处理。',
				'default_value' => 0,
				'step'          => 1,
			),
			array(
				'key'           => 'field_yx_v1_complete_the_look',
				'label'         => '搭配推荐',
				'name'          => 'complete_the_look',
				'type'          => 'relationship',
				'instructions'  => '选几个相关产品，会显示在这个产品详情页的底部。可留空。',
				'post_type'     => array( YANXINNA_Headless_Content::POST_TYPE ),
				'filters'       => array( 'search', 'taxonomy' ),
				'return_format' => 'id',
			),
			self::translations_field(),
		);
	}

	private static function sizes_field() {
		return array(
			'key'          => 'field_yx_v1_sizes',
			'label'        => '尺码 / 规格',
			'name'         => 'sizes',
			'type'         => 'repeater',
			'instructions' => '一行一个尺码，点「添加尺码」加行。至少要有一个。',
			'required'     => true,
			'min'          => 1,
			'layout'       => 'table',
			'button_label' => '添加尺码',
			'sub_fields'   => array(
				self::text_field( 'size_value', '尺码', true, 'value' ),
			),
		);
	}

	private static function colors_field() {
		$sub_fields = array(
			array(
				'key'      => 'field_yx_v1_color_hex',
				'label'    => '色值',
				'name'     => 'hex',
				'type'     => 'color_picker',
				'required' => true,
			),
			self::image_field( 'color_image', '该颜色的白底图', true, 'image' ),
			self::image_field( 'color_hover_image', '该颜色的模特图', true, 'hover_image' ),
			self::localized_group( 'color_names', '颜色名称', 'names', true ),
		);

		return array(
			'key'          => 'field_yx_v1_colors',
			'label'        => '颜色',
			'name'         => 'colors',
			'type'         => 'repeater',
			'instructions' => '一个颜色一组，点「添加颜色」加组。至少要有一个。',
			'required'     => true,
			'min'          => 1,
			'layout'       => 'block',
			'button_label' => '添加颜色',
			'sub_fields'   => $sub_fields,
		);
	}

	private static function parameters_field() {
		return array(
			'key'          => 'field_yx_v1_parameters',
			'label'        => '规格参数表',
			'name'         => 'parameters',
			'type'         => 'repeater',
			'instructions' => '详情页的参数表格，例如「材质 / 80% 尼龙」。可留空。',
			'layout'       => 'block',
			'button_label' => '添加参数',
			'sub_fields'   => array(
				self::localized_group( 'parameter_labels', '参数名', 'labels', true ),
				self::localized_group( 'parameter_values', '参数值', 'values', true ),
			),
		);
	}

	private static function attachments_field() {
		return array(
			'key'          => 'field_yx_v1_attachments',
			'label'        => 'PDF / 文档附件',
			'name'         => 'attachments',
			'type'         => 'repeater',
			'instructions' => '规格书、检测报告之类的文件。可留空。',
			'layout'       => 'block',
			'button_label' => '添加附件',
			'sub_fields'   => array(
				array(
					'key'           => 'field_yx_v1_attachment_file',
					'label'         => '文件',
					'name'          => 'file',
					'type'          => 'file',
					'required'      => true,
					'return_format' => 'array',
					'library'       => 'all',
					'mime_types'    => 'pdf,doc,docx,xls,xlsx,zip',
				),
				self::localized_group( 'attachment_labels', '显示名称', 'labels', true ),
			),
		);
	}

	private static function translations_field() {
		$sub_fields = array();

		foreach ( self::$locales as $locale => $label ) {
			$key_suffix = strtolower( str_replace( '-', '_', $locale ) );
			$is_default = self::DEFAULT_LOCALE === $locale;

			// 非默认语言全部收进一个默认折叠的手风琴，商家平时只看到俄语那一组。
			if ( ! $is_default && ! isset( $sub_fields['accordion'] ) ) {
				$sub_fields['accordion'] = array(
					'key'          => 'field_yx_v1_translations_other_start',
					'label'        => '其他语言（可留空，留空时自动显示俄语内容）',
					'type'         => 'accordion',
					'open'         => false,
					'multi_expand' => true,
					'endpoint'     => false,
				);
			}

			$sub_fields[] = array(
				'key'        => 'field_yx_v1_translation_' . $key_suffix,
				'label'      => $is_default ? $label . '（必填）' : $label,
				'name'       => $locale,
				'type'       => 'group',
				'layout'     => 'block',
				'sub_fields' => self::translation_fields( $key_suffix, $is_default ),
			);
		}

		$sub_fields[] = array(
			'key'      => 'field_yx_v1_translations_other_end',
			'label'    => '',
			'type'     => 'accordion',
			'endpoint' => true,
		);

		return array(
			'key'          => 'field_yx_v1_translations',
			'label'        => '多语言文案',
			'name'         => 'translations',
			'type'         => 'group',
			'instructions' => '只有俄语是必填。英语、法语、德语留空时，网站会自动显示俄语内容。',
			'layout'       => 'block',
			'sub_fields'   => array_values( $sub_fields ),
		);
	}

	private static function translation_fields( $key_suffix, $required ) {
		return array(
			self::text_field( 'translation_' . $key_suffix . '_name', '产品名称', $required, 'name' ),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_short_description',
				'label'        => '简短描述',
				'name'         => 'short_description',
				'type'         => 'textarea',
				'instructions' => '一句话，出现在产品列表里。',
				'required'     => $required,
				'rows'         => 3,
				'new_lines'    => 'br',
			),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_description',
				'label'        => '详细描述',
				'name'         => 'description',
				'type'         => 'wysiwyg',
				'instructions' => '产品详情页的正文，两三句话即可。',
				'required'     => $required,
				'tabs'         => 'all',
				'toolbar'      => 'basic',
				'media_upload' => false,
			),
			self::text_field( 'translation_' . $key_suffix . '_badge', '角标', false, 'badge', '产品图上的小标签，如「新品」。可留空。' ),
			self::text_field( 'translation_' . $key_suffix . '_fabric', '面料成分', $required, 'fabric', '例如：80% 尼龙, 20% 氨纶。要写真实成分。' ),
			self::text_field( 'translation_' . $key_suffix . '_care', '洗涤保养', $required, 'care' ),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_benefits',
				'label'        => '产品卖点',
				'name'         => 'benefits',
				'type'         => 'repeater',
				'instructions' => '一行一条，3–4 条即可。',
				'required'     => $required,
				'min'          => $required ? 1 : 0,
				'layout'       => 'table',
				'button_label' => '添加卖点',
				'sub_fields'   => array(
					self::text_field(
						'translation_' . $key_suffix . '_benefit_value',
						'卖点',
						$required,
						'value'
					),
				),
			),
			self::text_field( 'translation_' . $key_suffix . '_seo_title', 'SEO 标题', $required, 'seo_title', '搜索引擎结果里显示的标题，一般是「产品名 | YANXINNA」。' ),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_seo_description',
				'label'        => 'SEO 描述',
				'name'         => 'seo_description',
				'type'         => 'textarea',
				'instructions' => '搜索结果里标题下面那段说明，不超过 320 字符。',
				'required'     => $required,
				'rows'         => 3,
				'maxlength'    => 320,
			),
		);
	}

	private static function localized_group( $key_name, $label, $name, $required ) {
		$sub_fields = array();

		foreach ( self::$locales as $locale => $locale_label ) {
			$key_suffix   = strtolower( str_replace( '-', '_', $locale ) );
			$is_default   = self::DEFAULT_LOCALE === $locale;
			$sub_fields[] = self::text_field(
				$key_name . '_' . $key_suffix,
				$is_default ? $locale_label . '（必填）' : $locale_label,
				$required && $is_default,
				$locale
			);
		}

		return array(
			'key'        => 'field_yx_v1_' . $key_name,
			'label'      => $label,
			'name'       => $name,
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => $sub_fields,
		);
	}

	private static function text_field( $key_name, $label, $required, $name = null, $instructions = '' ) {
		return array(
			'key'          => 'field_yx_v1_' . $key_name,
			'label'        => $label,
			'name'         => $name ? $name : $key_name,
			'type'         => 'text',
			'instructions' => $instructions,
			'required'     => $required,
		);
	}

	private static function image_field( $key_name, $label, $required, $name = null, $instructions = '' ) {
		return array(
			'key'           => 'field_yx_v1_' . $key_name,
			'label'         => $label,
			'name'          => $name ? $name : $key_name,
			'type'          => 'image',
			'instructions'  => $instructions,
			'required'      => $required,
			'return_format' => 'array',
			'preview_size'  => 'medium',
			'library'       => 'all',
		);
	}

	private static function boolean_field( $name, $label, $instructions = '' ) {
		return array(
			'key'           => 'field_yx_v1_' . $name,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'true_false',
			'instructions'  => $instructions,
			'default_value' => false,
			'ui'            => true,
		);
	}
}
