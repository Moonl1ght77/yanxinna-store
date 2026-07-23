<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Webhook {
	private static $pending             = array();
	private static $shutdown_registered = false;

	public static function register() {
		add_action( 'save_post_' . YANXINNA_Headless_Content::POST_TYPE, array( __CLASS__, 'on_save' ), 20, 3 );
		add_action( 'transition_post_status', array( __CLASS__, 'on_status_transition' ), 20, 3 );
		add_action( 'before_delete_post', array( __CLASS__, 'on_delete' ), 20, 2 );
		add_action( 'set_object_terms', array( __CLASS__, 'on_terms_changed' ), 20, 6 );
	}

	public static function on_save( $post_id, WP_Post $post, $update ) {
		unset( $update );

		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		self::notify( $post );
	}

	public static function on_status_transition( $new_status, $old_status, WP_Post $post ) {
		if (
			YANXINNA_Headless_Content::POST_TYPE !== $post->post_type ||
			$new_status === $old_status
		) {
			return;
		}

		self::notify( $post );
	}

	public static function on_delete( $post_id, WP_Post $post ) {
		unset( $post_id );

		if ( YANXINNA_Headless_Content::POST_TYPE === $post->post_type ) {
			self::notify( $post );
		}
	}

	public static function on_terms_changed( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {
		unset( $terms, $tt_ids, $append, $old_tt_ids );

		if ( YANXINNA_Headless_Content::TAXONOMY !== $taxonomy ) {
			return;
		}

		$post = get_post( $object_id );
		if ( $post && YANXINNA_Headless_Content::POST_TYPE === $post->post_type ) {
			self::notify( $post );
		}
	}

	private static function notify( WP_Post $post ) {
		$slug = sanitize_title( $post->post_name );
		self::$pending[ (int) $post->ID ] = $slug;

		if ( ! self::$shutdown_registered ) {
			self::$shutdown_registered = true;
			add_action( 'shutdown', array( __CLASS__, 'flush' ), 99 );
		}
	}

	public static function flush() {
		if (
			! defined( 'YANXINNA_FRONTEND_URL' ) ||
			! defined( 'YANXINNA_REVALIDATE_SECRET' ) ||
			! YANXINNA_FRONTEND_URL ||
			! YANXINNA_REVALIDATE_SECRET
		) {
			return;
		}

		$url = trailingslashit( esc_url_raw( YANXINNA_FRONTEND_URL ) ) . 'api/revalidate';
		if ( ! wp_http_validate_url( $url ) ) {
			error_log( '[YANXINNA Headless Products] Cache refresh skipped: invalid frontend URL.' );
			return;
		}

		foreach ( self::$pending as $slug ) {
			wp_remote_post(
				$url,
				array(
					'timeout'  => 5,
					'blocking' => false,
					'headers'  => array(
						'Content-Type'      => 'application/json',
						'x-yanxinna-secret' => (string) YANXINNA_REVALIDATE_SECRET,
					),
					'body'     => wp_json_encode( array( 'slug' => $slug ) ),
				)
			);
		}

		self::$pending = array();
	}
}
