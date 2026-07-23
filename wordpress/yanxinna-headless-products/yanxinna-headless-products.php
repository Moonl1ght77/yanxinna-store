<?php
/**
 * Plugin Name: YANXINNA Headless Products
 * Description: Product content model and public read-only API for the YANXINNA headless storefront.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: YANXINNA
 * Text Domain: yanxinna-headless-products
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'YANXINNA_HEADLESS_PRODUCTS_VERSION', '1.0.0' );
define( 'YANXINNA_HEADLESS_PRODUCTS_PATH', plugin_dir_path( __FILE__ ) );

require_once YANXINNA_HEADLESS_PRODUCTS_PATH . 'includes/class-content.php';
require_once YANXINNA_HEADLESS_PRODUCTS_PATH . 'includes/class-fields.php';

add_action( 'init', array( 'YANXINNA_Headless_Content', 'register' ) );
add_action( 'acf/init', array( 'YANXINNA_Headless_Fields', 'register' ) );

register_activation_hook(
	__FILE__,
	function () {
		YANXINNA_Headless_Content::register();
		YANXINNA_Headless_Content::install_roles();
		flush_rewrite_rules();
	}
);

register_deactivation_hook(
	__FILE__,
	function () {
		flush_rewrite_rules();
	}
);

add_action(
	'admin_notices',
	function () {
		if ( function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		printf(
			'<div class="notice notice-error"><p>%s</p></div>',
			esc_html__(
				'YANXINNA Headless Products requires an active, licensed copy of ACF PRO. Product API output remains disabled until ACF PRO is available.',
				'yanxinna-headless-products'
			)
		);
	}
);
