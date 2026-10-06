<?php
/**
 * Import a products.json catalogue into WordPress with WP-CLI.
 *
 * The actual import logic lives in the plugin (includes/class-importer.php) and is shared
 * with the admin "批量导入" page; this file only parses arguments and prints progress.
 *
 * Usage (WP-CLI swallows --flags after eval-file, so set $args in a wrapper file):
 *   <?php $args = array( '--media-dir=' . __DIR__ . '/media', '--status=publish' ); require __DIR__ . '/import-products.php';
 * Media source: --media-dir=<local directory> or --media-base-url=https://…
 * Post status:  --status=draft (default) or --status=publish
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "This importer must be executed with WP-CLI.\n" );
	exit( 1 );
}

if ( ! function_exists( 'update_field' ) ) {
	WP_CLI::error( 'ACF PRO must be active before running the importer.' );
}

if ( ! class_exists( 'YANXINNA_Headless_Importer' ) ) {
	WP_CLI::error( 'The YANXINNA Headless Products plugin must be active.' );
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$media_base    = '';
$media_dir     = '';
$post_status   = 'draft';
$script_args   = isset( $args ) && is_array( $args ) ? $args : array();
$payload_path  = __DIR__ . '/products.json';

foreach ( $script_args as $argument ) {
	if ( 0 === strpos( $argument, '--media-base-url=' ) ) {
		$media_base = substr( $argument, strlen( '--media-base-url=' ) );
	} elseif ( 0 === strpos( $argument, '--media-dir=' ) ) {
		$media_dir = rtrim( substr( $argument, strlen( '--media-dir=' ) ), '/\\' );
	} elseif ( 0 === strpos( $argument, '--status=' ) ) {
		$post_status = substr( $argument, strlen( '--status=' ) );
	}
}

if ( ! in_array( $post_status, array( 'draft', 'publish' ), true ) ) {
	WP_CLI::error( '--status must be draft or publish.' );
}

if ( $media_dir ) {
	if ( ! is_dir( $media_dir ) ) {
		WP_CLI::error( '--media-dir does not exist: ' . $media_dir );
	}
} else {
	$media_base = esc_url_raw( $media_base );
	if ( ! $media_base || ! wp_http_validate_url( $media_base ) ) {
		WP_CLI::error( 'Pass --media-dir=<local directory> or a valid HTTPS --media-base-url that serves the files referenced by products.json.' );
	}
}

$raw_payload = file_get_contents( $payload_path );
$payload     = $raw_payload ? json_decode( $raw_payload, true ) : null;

if ( ! is_array( $payload ) || empty( $payload['products'] ) || ! is_array( $payload['products'] ) ) {
	WP_CLI::error( 'products.json is missing or invalid.' );
}

$importer = new YANXINNA_Headless_Importer(
	array(
		'media_dir'  => $media_dir,
		'media_base' => $media_base,
		'status'     => $post_status,
	)
);

$summary = $importer->import_items(
	$payload['products'],
	function ( $level, $message ) {
		if ( 'warning' === $level ) {
			WP_CLI::warning( $message );
		} else {
			WP_CLI::log( $message );
		}
	}
);

WP_CLI::success(
	sprintf(
		'Import finished. Created: %d, updated: %d, failed: %d. Imported products are now %s.',
		$summary['created'],
		$summary['updated'],
		$summary['failed'],
		$post_status
	)
);
