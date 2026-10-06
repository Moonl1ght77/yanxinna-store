<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 把一组产品数据写进 WordPress：建/更新文章、分类、图片、所有 ACF 字段。
 *
 * 同一份逻辑给两个入口用：WP-CLI 导入器（wordpress/migration/import-products.php）
 * 和后台的「批量导入」页。产品按 product_number 匹配，重复导入是更新。
 *
 * 每条产品的结构见 docs/wordpress/fields.md 和 wordpress/migration/products.json。
 * 图片字段写的是相对路径，从 media_dir（本地目录）或 media_base（HTTPS 根地址）取。
 */
final class YANXINNA_Headless_Importer {
	const LOCALES = array( 'ru-RU', 'en-US', 'en-GB', 'fr-FR', 'de-DE' );

	private $media_dir;
	private $media_base;
	private $status;
	private $media_cache = array();
	private $posts_by_sku = array();

	/**
	 * @param array $args media_dir | media_base（二选一），status = draft | publish。
	 */
	public function __construct( array $args ) {
		$this->media_dir  = isset( $args['media_dir'] ) ? rtrim( (string) $args['media_dir'], '/\\' ) : '';
		$this->media_base = isset( $args['media_base'] ) ? (string) $args['media_base'] : '';
		$this->status     = isset( $args['status'] ) && 'publish' === $args['status'] ? 'publish' : 'draft';

		if ( ! $this->media_dir && ! $this->media_base ) {
			throw new InvalidArgumentException( 'Pass media_dir or media_base.' );
		}
		if ( $this->media_dir && ! is_dir( $this->media_dir ) ) {
			throw new InvalidArgumentException( 'media_dir does not exist: ' . $this->media_dir );
		}
	}

	/**
	 * 先把所有文章建出来再填字段，这样「搭配推荐」能引用同一批里的产品。
	 *
	 * @param array         $items 产品数组。
	 * @param callable|null $log   function ( string $level, string $message )，level 是 log | warning。
	 * @return array created / updated / failed 计数 + 每条的 results。
	 */
	public function import_items( array $items, $log = null ) {
		$log     = is_callable( $log ) ? $log : function () {};
		$summary = array(
			'created' => 0,
			'updated' => 0,
			'failed'  => 0,
			'results' => array(),
		);
		$pending = array();

		foreach ( $items as $item ) {
			$product_number = sanitize_text_field( (string) ( $item['product_number'] ?? '' ) );
			$english        = isset( $item['translations']['en-US'] ) && is_array( $item['translations']['en-US'] )
				? $item['translations']['en-US']
				: array();
			$title          = sanitize_text_field( (string) ( $english['name'] ?? $product_number ) );

			if ( ! $product_number || ! $title ) {
				++$summary['failed'];
				$summary['results'][] = array(
					'product_number' => $product_number,
					'error'          => 'no product number or English name',
				);
				$log( 'warning', 'Skipped a product with no product number or English name.' );
				continue;
			}

			$existing_id = $this->find_product( $product_number );
			$post_data   = array(
				'post_type'   => YANXINNA_Headless_Content::POST_TYPE,
				'post_status' => $this->status,
				'post_title'  => $title,
				'post_name'   => sanitize_title( $item['slug'] ?? $product_number ),
			);

			if ( $existing_id ) {
				$post_data['ID'] = $existing_id;
				$post_id         = wp_update_post( wp_slash( $post_data ), true );
				$action          = 'updated';
			} else {
				$post_id = wp_insert_post( wp_slash( $post_data ), true );
				$action  = 'created';
			}

			if ( is_wp_error( $post_id ) ) {
				++$summary['failed'];
				$summary['results'][] = array(
					'product_number' => $product_number,
					'error'          => $post_id->get_error_message(),
				);
				$log( 'warning', sprintf( '%s failed: %s', $product_number, $post_id->get_error_message() ) );
				continue;
			}

			$this->posts_by_sku[ $product_number ] = (int) $post_id;
			$pending[]                             = array(
				'action' => $action,
				'id'     => (int) $post_id,
				'item'   => $item,
			);
		}

		foreach ( $pending as $entry ) {
			$sku = sanitize_text_field( $entry['item']['product_number'] );
			try {
				$this->write_fields( $entry['id'], $entry['item'] );
				++$summary[ 'created' === $entry['action'] ? 'created' : 'updated' ];
				$summary['results'][] = array(
					'product_number' => $sku,
					'action'         => $entry['action'],
					'id'             => $entry['id'],
					'slug'           => get_post_field( 'post_name', $entry['id'] ),
				);
				$log( 'log', sprintf( '%s %s as %s (post %d).', ucfirst( $entry['action'] ), $sku, $this->status, $entry['id'] ) );
			} catch ( Throwable $error ) {
				++$summary['failed'];
				$summary['results'][] = array(
					'product_number' => $sku,
					'id'             => $entry['id'],
					'error'          => $error->getMessage(),
				);
				$log( 'warning', sprintf( '%s failed: %s', $sku, $error->getMessage() ) );
			}
		}

		return $summary;
	}

	private function write_fields( $post_id, array $item ) {
		$sku = sanitize_text_field( $item['product_number'] );

		$category_id    = $this->ensure_term( $item['category'] ?? '' );
		$subcategory_id = ! empty( $item['subcategory'] )
			? $this->ensure_term( $item['subcategory'], $category_id )
			: 0;
		$term_ids       = array_filter( array( $category_id, $subcategory_id ) );
		$term_result    = wp_set_object_terms( $post_id, $term_ids, YANXINNA_Headless_Content::TAXONOMY, false );
		if ( is_wp_error( $term_result ) ) {
			throw new RuntimeException( $term_result->get_error_message() );
		}

		$main_image_id = $this->sideload_media( $item['main_image'] ?? '', $post_id, $sku );
		if ( ! $main_image_id ) {
			throw new RuntimeException( 'Main image is required.' );
		}
		set_post_thumbnail( $post_id, $main_image_id );

		$hover_image_id = $this->sideload_media( $item['hover_image'] ?? '', $post_id, $sku );
		$gallery_ids    = array();
		foreach ( $item['gallery'] ?? array() as $gallery_path ) {
			$gallery_ids[] = $this->sideload_media( $gallery_path, $post_id, $sku );
		}

		$colors = array();
		foreach ( $item['colors'] ?? array() as $color ) {
			$colors[] = array(
				'hex'         => sanitize_hex_color( $color['hex'] ?? '' ),
				'image'       => $this->sideload_media( $color['image'] ?? '', $post_id, $sku ),
				'hover_image' => $this->sideload_media( $color['hover_image'] ?? '', $post_id, $sku ),
				'names'       => $this->localized_values( $color['names'] ?? array() ),
			);
		}

		$parameters = array();
		foreach ( $item['parameters'] ?? array() as $parameter ) {
			$parameters[] = array(
				'labels' => $this->localized_values( $parameter['labels'] ?? array() ),
				'values' => $this->localized_values( $parameter['values'] ?? array() ),
			);
		}

		$attachments = array();
		foreach ( $item['attachments'] ?? array() as $attachment ) {
			$attachments[] = array(
				'file'   => $this->sideload_media( $attachment['file'] ?? '', $post_id, $sku ),
				'labels' => $this->localized_values( $attachment['labels'] ?? array() ),
			);
		}

		update_field( 'field_yx_v1_product_number', $sku, $post_id );
		update_field( 'field_yx_v1_hover_image', $hover_image_id, $post_id );
		update_field( 'field_yx_v1_gallery', array_values( array_filter( $gallery_ids ) ), $post_id );
		update_field(
			'field_yx_v1_sizes',
			array_map(
				function ( $size ) {
					return array( 'value' => sanitize_text_field( $size ) );
				},
				$item['sizes'] ?? array()
			),
			$post_id
		);
		update_field( 'field_yx_v1_colors', $colors, $post_id );
		update_field( 'field_yx_v1_parameters', $parameters, $post_id );
		update_field( 'field_yx_v1_attachments', $attachments, $post_id );
		update_field( 'field_yx_v1_compression_level', sanitize_text_field( $item['compression_level'] ?? '' ), $post_id );
		update_field( 'field_yx_v1_featured', ! empty( $item['featured'] ) ? 1 : 0, $post_id );
		update_field( 'field_yx_v1_best_seller', ! empty( $item['best_seller'] ) ? 1 : 0, $post_id );
		update_field( 'field_yx_v1_sort_order', (int) ( $item['sort_order'] ?? 0 ), $post_id );
		update_field( 'field_yx_v1_complete_the_look', $this->resolve_related( $item['complete_the_look'] ?? array() ), $post_id );
		update_field( 'field_yx_v1_translations', self::translations_rows( $item['translations'] ?? array() ), $post_id );

		wp_update_post(
			array(
				'ID'          => $post_id,
				'post_status' => $this->status,
			)
		);
	}

	/** 把 { locale: { name, benefits: [string] ... } } 整理成 ACF 要的行结构（benefits 变 repeater 行）。 */
	public static function translations_rows( array $translations ) {
		$rows = array();
		foreach ( self::LOCALES as $locale ) {
			$translation = isset( $translations[ $locale ] ) && is_array( $translations[ $locale ] )
				? $translations[ $locale ]
				: array();
			$benefits    = array_map(
				function ( $benefit ) {
					return array( 'value' => sanitize_text_field( is_array( $benefit ) ? ( $benefit['value'] ?? '' ) : $benefit ) );
				},
				is_array( $translation['benefits'] ?? null ) ? $translation['benefits'] : array()
			);
			$rows[ $locale ] = array(
				'name'              => sanitize_text_field( (string) ( $translation['name'] ?? '' ) ),
				'short_description' => sanitize_textarea_field( (string) ( $translation['short_description'] ?? '' ) ),
				'description'       => wp_kses_post( (string) ( $translation['description'] ?? '' ) ),
				'badge'             => sanitize_text_field( (string) ( $translation['badge'] ?? '' ) ),
				'fabric'            => sanitize_text_field( (string) ( $translation['fabric'] ?? '' ) ),
				'care'              => sanitize_text_field( (string) ( $translation['care'] ?? '' ) ),
				'benefits'          => $benefits,
				'seo_title'         => sanitize_text_field( (string) ( $translation['seo_title'] ?? '' ) ),
				'seo_description'   => sanitize_textarea_field( (string) ( $translation['seo_description'] ?? '' ) ),
			);
		}
		return $rows;
	}

	private function find_product( $product_number ) {
		$matches = get_posts(
			array(
				'post_type'      => YANXINNA_Headless_Content::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'meta_query'     => array(
					array(
						'key'     => 'product_number',
						'value'   => sanitize_text_field( $product_number ),
						'compare' => '=',
					),
				),
				'fields'         => 'ids',
			)
		);

		return $matches ? (int) $matches[0] : 0;
	}

	private function localized_values( $values ) {
		$result = array();
		$values = is_array( $values ) ? $values : array();
		foreach ( self::LOCALES as $locale ) {
			$result[ $locale ] = sanitize_text_field( (string) ( $values[ $locale ] ?? '' ) );
		}
		return $result;
	}

	private function ensure_term( $slug, $parent = 0 ) {
		$slug = sanitize_title( $slug );
		$term = term_exists( $slug, YANXINNA_Headless_Content::TAXONOMY );
		if ( $term ) {
			return (int) ( is_array( $term ) ? $term['term_id'] : $term );
		}

		$created_term = wp_insert_term(
			ucwords( str_replace( '-', ' ', $slug ) ),
			YANXINNA_Headless_Content::TAXONOMY,
			array(
				'slug'   => $slug,
				'parent' => (int) $parent,
			)
		);
		if ( is_wp_error( $created_term ) ) {
			throw new RuntimeException( $created_term->get_error_message() );
		}

		return (int) $created_term['term_id'];
	}

	private function resolve_related( $product_numbers ) {
		$related = array();
		foreach ( is_array( $product_numbers ) ? $product_numbers : array() as $product_number ) {
			$product_number = sanitize_text_field( $product_number );
			$post_id        = $this->posts_by_sku[ $product_number ] ?? $this->find_product( $product_number );
			if ( $post_id ) {
				$related[] = (int) $post_id;
			}
		}
		return array_values( array_unique( $related ) );
	}

	/**
	 * 把一张图放进媒体库并返回附件 ID。同一来源（路径 + 内容 md5，或 URL）只传一次。
	 */
	private function sideload_media( $relative_path, $post_id, $description = '' ) {
		$relative_path = ltrim( (string) $relative_path, '/' );
		if ( ! $relative_path ) {
			return 0;
		}

		if ( $this->media_dir ) {
			$source_path = $this->media_dir . '/' . $relative_path;
			if ( ! is_file( $source_path ) ) {
				throw new RuntimeException( 'Media file not found: ' . $relative_path );
			}
			$source_url = 'media-dir:' . $relative_path . '#' . md5_file( $source_path );
		} else {
			$source_url = esc_url_raw( trailingslashit( $this->media_base ) . $relative_path );
		}

		if ( isset( $this->media_cache[ $source_url ] ) ) {
			return $this->media_cache[ $source_url ];
		}

		$existing = get_posts(
			array(
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'posts_per_page' => 1,
				'meta_query'     => array(
					array(
						'key'     => '_yanxinna_source_url',
						'value'   => $source_url,
						'compare' => '=',
					),
				),
				'fields'         => 'ids',
			)
		);
		if ( $existing ) {
			$this->media_cache[ $source_url ] = (int) $existing[0];
			return (int) $existing[0];
		}

		if ( $this->media_dir ) {
			$temp_file = wp_tempnam( wp_basename( $source_path ) );
			if ( ! $temp_file || ! copy( $source_path, $temp_file ) ) {
				throw new RuntimeException( 'Could not copy media file: ' . $relative_path );
			}
			$file_name = sanitize_file_name( wp_basename( $source_path ) );
		} else {
			$temp_file = download_url( $source_url, 30 );
			if ( is_wp_error( $temp_file ) ) {
				throw new RuntimeException( $temp_file->get_error_message() );
			}
			$url_path  = wp_parse_url( $source_url, PHP_URL_PATH );
			$file_name = sanitize_file_name( rawurldecode( wp_basename( $url_path ) ) );
		}

		$attachment_id = media_handle_sideload(
			array(
				'name'     => $file_name,
				'tmp_name' => $temp_file,
			),
			$post_id,
			sanitize_text_field( $description )
		);
		if ( is_wp_error( $attachment_id ) ) {
			@unlink( $temp_file );
			throw new RuntimeException( $attachment_id->get_error_message() );
		}

		update_post_meta( $attachment_id, '_yanxinna_source_url', $source_url );
		$this->media_cache[ $source_url ] = (int) $attachment_id;

		return (int) $attachment_id;
	}
}
