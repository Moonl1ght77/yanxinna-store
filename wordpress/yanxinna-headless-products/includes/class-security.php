<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Security {
	public static function register() {
		add_filter( 'rest_pre_dispatch', array( __CLASS__, 'enforce_read_only' ), 10, 3 );
		add_filter( 'rest_pre_serve_request', array( __CLASS__, 'send_cors_headers' ), 20, 4 );
	}

	public static function enforce_read_only( $result, WP_REST_Server $server, WP_REST_Request $request ) {
		if ( ! self::is_public_route( $request->get_route() ) ) {
			return $result;
		}

		if ( in_array( $request->get_method(), array( 'GET', 'OPTIONS' ), true ) ) {
			return $result;
		}

		return new WP_Error(
			'yanxinna_method_not_allowed',
			__( 'Only read-only product requests are allowed.', 'yanxinna-headless-products' ),
			array( 'status' => 405 )
		);
	}

	public static function send_cors_headers( $served, $result, WP_REST_Request $request, WP_REST_Server $server ) {
		unset( $result, $server );

		if ( ! self::is_public_route( $request->get_route() ) ) {
			return $served;
		}

		header_remove( 'Access-Control-Allow-Credentials' );
		$origin  = get_http_origin();
		$allowed = self::allowed_origins();

		if ( $origin && in_array( untrailingslashit( $origin ), $allowed, true ) ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ), true );
			header( 'Vary: Origin', false );
			header( 'Access-Control-Allow-Methods: GET, OPTIONS', true );
			header( 'Access-Control-Allow-Headers: Content-Type', true );
			header( 'Access-Control-Max-Age: 600', true );
		} else {
			header_remove( 'Access-Control-Allow-Origin' );
		}

		return $served;
	}

	private static function allowed_origins() {
		if ( ! defined( 'YANXINNA_ALLOWED_ORIGINS' ) || ! YANXINNA_ALLOWED_ORIGINS ) {
			return array();
		}

		$origins = array_map( 'trim', explode( ',', YANXINNA_ALLOWED_ORIGINS ) );
		$origins = array_filter(
			$origins,
			function ( $origin ) {
				return (bool) wp_http_validate_url( $origin );
			}
		);

		return array_values(
			array_unique(
				array_map(
					function ( $origin ) {
						return untrailingslashit( esc_url_raw( $origin ) );
					},
					$origins
				)
			)
		);
	}

	private static function is_public_route( $route ) {
		return 0 === strpos( (string) $route, '/' . YANXINNA_Headless_REST::NAMESPACE . '/' );
	}
}
