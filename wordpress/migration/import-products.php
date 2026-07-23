<?php
/**
 * Import the legacy YANXINNA product catalogue as WordPress drafts.
 *
 * Usage:
 * wp eval-file /secure/path/import-products.php \
 *   -- --media-base-url=https://staging-store.example.com/
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "This importer must be executed with WP-CLI.\n" );
	exit( 1 );
}

if ( ! function_exists( 'update_field' ) ) {
	WP_CLI::error( 'ACF PRO must be active before running the importer.' );
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$locales       = array( 'ru-RU', 'en-US', 'en-GB', 'fr-FR', 'de-DE' );
$media_base    = '';
$script_args   = isset( $args ) && is_array( $args ) ? $args : array();
$payload_path  = __DIR__ . '/products.json';
$created       = 0;
$updated       = 0;
$failed        = 0;
$posts_by_sku  = array();
$pending_items = array();
$media_cache   = array();

foreach ( $script_args as $argument ) {
	if ( 0 === strpos( $argument, '--media-base-url=' ) ) {
		$media_base = substr( $argument, strlen( '--media-base-url=' ) );
	}
}

$media_base = esc_url_raw( $media_base );
if ( ! $media_base || ! wp_http_validate_url( $media_base ) ) {
	WP_CLI::error( 'Pass a valid HTTPS --media-base-url that serves the files referenced by products.json.' );
}

$raw_payload = file_get_contents( $payload_path );
$payload     = $raw_payload ? json_decode( $raw_payload, true ) : null;

if ( ! is_array( $payload ) || empty( $payload['products'] ) || ! is_array( $payload['products'] ) ) {
	WP_CLI::error( 'products.json is missing or invalid.' );
}

$find_product = function ( $product_number ) {
	$matches = get_posts(
		array(
			'post_type'      => 'yx_product',
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
};

foreach ( $payload['products'] as $item ) {
	$product_number = sanitize_text_field( (string) ( $item['product_number'] ?? '' ) );
	$english         = isset( $item['translations']['en-US'] ) && is_array( $item['translations']['en-US'] )
		? $item['translations']['en-US']
		: array();
	$title           = sanitize_text_field( (string) ( $english['name'] ?? $product_number ) );

	if ( ! $product_number || ! $title ) {
		++$failed;
		WP_CLI::warning( 'Skipped a product with no product number or English name.' );
		continue;
	}

	$existing_id = $find_product( $product_number );
	$post_data   = array(
		'post_type'   => 'yx_product',
		'post_status' => 'draft',
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
		++$failed;
		WP_CLI::warning( sprintf( '%s failed: %s', $product_number, $post_id->get_error_message() ) );
		continue;
	}

	$posts_by_sku[ $product_number ] = (int) $post_id;
	$pending_items[]                 = array(
		'action' => $action,
		'id'     => (int) $post_id,
		'item'   => $item,
	);
}

$localized_values = function ( $values ) use ( $locales ) {
	$result = array();
	$values = is_array( $values ) ? $values : array();

	foreach ( $locales as $locale ) {
		$result[ $locale ] = sanitize_text_field( (string) ( $values[ $locale ] ?? '' ) );
	}

	return $result;
};

$ensure_term = function ( $slug, $parent = 0 ) {
	$slug = sanitize_title( $slug );
	$term = term_exists( $slug, 'yx_product_category' );

	if ( $term ) {
		return (int) ( is_array( $term ) ? $term['term_id'] : $term );
	}

	$created_term = wp_insert_term(
		ucwords( str_replace( '-', ' ', $slug ) ),
		'yx_product_category',
		array(
			'slug'   => $slug,
			'parent' => (int) $parent,
		)
	);

	if ( is_wp_error( $created_term ) ) {
		throw new RuntimeException( $created_term->get_error_message() );
	}

	return (int) $created_term['term_id'];
};

$sideload_media = function ( $relative_path, $post_id, $description = '' ) use ( $media_base, &$media_cache ) {
	$relative_path = ltrim( (string) $relative_path, '/' );
	if ( ! $relative_path ) {
		return 0;
	}

	$source_url = esc_url_raw( trailingslashit( $media_base ) . $relative_path );
	if ( isset( $media_cache[ $source_url ] ) ) {
		return $media_cache[ $source_url ];
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
		$media_cache[ $source_url ] = (int) $existing[0];
		return (int) $existing[0];
	}

	$temp_file = download_url( $source_url, 30 );
	if ( is_wp_error( $temp_file ) ) {
		throw new RuntimeException( $temp_file->get_error_message() );
	}

	$url_path   = wp_parse_url( $source_url, PHP_URL_PATH );
	$file_array = array(
		'name'     => sanitize_file_name( rawurldecode( wp_basename( $url_path ) ) ),
		'tmp_name' => $temp_file,
	);
	$attachment_id = media_handle_sideload(
		$file_array,
		$post_id,
		sanitize_text_field( $description )
	);

	if ( is_wp_error( $attachment_id ) ) {
		@unlink( $temp_file );
		throw new RuntimeException( $attachment_id->get_error_message() );
	}

	update_post_meta( $attachment_id, '_yanxinna_source_url', $source_url );
	$media_cache[ $source_url ] = (int) $attachment_id;

	return (int) $attachment_id;
};

$resolve_related = function ( $product_numbers ) use ( &$posts_by_sku, $find_product ) {
	$related = array();

	foreach ( is_array( $product_numbers ) ? $product_numbers : array() as $product_number ) {
		$product_number = sanitize_text_field( $product_number );
		$post_id        = $posts_by_sku[ $product_number ] ?? $find_product( $product_number );
		if ( $post_id ) {
			$related[] = (int) $post_id;
		}
	}

	return array_values( array_unique( $related ) );
};

foreach ( $pending_items as $pending ) {
	$post_id = $pending['id'];
	$item    = $pending['item'];
	$sku     = sanitize_text_field( $item['product_number'] );

	try {
		$category_id    = $ensure_term( $item['category'] ?? '' );
		$subcategory_id = ! empty( $item['subcategory'] )
			? $ensure_term( $item['subcategory'], $category_id )
			: 0;
		$term_ids       = array_filter( array( $category_id, $subcategory_id ) );
		$term_result    = wp_set_object_terms( $post_id, $term_ids, 'yx_product_category', false );

		if ( is_wp_error( $term_result ) ) {
			throw new RuntimeException( $term_result->get_error_message() );
		}

		$main_image_id = $sideload_media( $item['main_image'] ?? '', $post_id, $sku );
		if ( ! $main_image_id ) {
			throw new RuntimeException( 'Main image is required.' );
		}
		set_post_thumbnail( $post_id, $main_image_id );

		$hover_image_id = $sideload_media( $item['hover_image'] ?? '', $post_id, $sku );
		$gallery_ids    = array();
		foreach ( $item['gallery'] ?? array() as $gallery_path ) {
			$gallery_ids[] = $sideload_media( $gallery_path, $post_id, $sku );
		}

		$colors = array();
		foreach ( $item['colors'] ?? array() as $color ) {
			$colors[] = array(
				'hex'         => sanitize_hex_color( $color['hex'] ?? '' ),
				'image'       => $sideload_media( $color['image'] ?? '', $post_id, $sku ),
				'hover_image' => $sideload_media( $color['hover_image'] ?? '', $post_id, $sku ),
				'names'       => $localized_values( $color['names'] ?? array() ),
			);
		}

		$parameters = array();
		foreach ( $item['parameters'] ?? array() as $parameter ) {
			$parameters[] = array(
				'labels' => $localized_values( $parameter['labels'] ?? array() ),
				'values' => $localized_values( $parameter['values'] ?? array() ),
			);
		}

		$attachments = array();
		foreach ( $item['attachments'] ?? array() as $attachment ) {
			$attachments[] = array(
				'file'   => $sideload_media( $attachment['file'] ?? '', $post_id, $sku ),
				'labels' => $localized_values( $attachment['labels'] ?? array() ),
			);
		}

		$translations = array();
		foreach ( $locales as $locale ) {
			$translation             = isset( $item['translations'][ $locale ] ) && is_array( $item['translations'][ $locale ] )
				? $item['translations'][ $locale ]
				: array();
			$benefits                = array_map(
				function ( $benefit ) {
					return array( 'value' => sanitize_text_field( $benefit ) );
				},
				is_array( $translation['benefits'] ?? null ) ? $translation['benefits'] : array()
			);
			$translations[ $locale ] = array(
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
		update_field( 'field_yx_v1_complete_the_look', $resolve_related( $item['complete_the_look'] ?? array() ), $post_id );
		update_field( 'field_yx_v1_translations', $translations, $post_id );

		wp_update_post(
			array(
				'ID'          => $post_id,
				'post_status' => 'draft',
			)
		);

		if ( 'created' === $pending['action'] ) {
			++$created;
		} else {
			++$updated;
		}

		WP_CLI::log( sprintf( '%s %s as draft (post %d).', ucfirst( $pending['action'] ), $sku, $post_id ) );
	} catch ( Throwable $error ) {
		++$failed;
		WP_CLI::warning( sprintf( '%s failed: %s', $sku, $error->getMessage() ) );
	}
}

WP_CLI::success(
	sprintf(
		'Import finished. Created: %d, updated: %d, failed: %d. All imported products remain drafts.',
		$created,
		$updated,
		$failed
	)
);
