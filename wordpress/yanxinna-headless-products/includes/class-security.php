<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Security {
	public static function register() {
		add_filter( 'rest_pre_dispatch', array( __CLASS__, 'enforce_read_only' ), 10, 3 );
		add_filter( 'rest_pre_serve_request', array( __CLASS__, 'send_cors_headers' ), 20, 4 );
		add_filter( 'rest_endpoints', array( __CLASS__, 'hide_user_endpoints' ) );
		// 优先级 1：必须早于 redirect_canonical（默认 10），否则 ?author=N 会先 301 出用户名。
		add_action( 'template_redirect', array( __CLASS__, 'block_author_enumeration' ), 1 );
	}

	/**
	 * 未登录时移除核心用户端点。站点是 headless CMS，公开访客不需要读用户列表，
	 * 而默认开放的 /wp/v2/users 会直接吐出管理员用户名，便于定向爆破。
	 */
	public static function hide_user_endpoints( $endpoints ) {
		if ( is_user_logged_in() ) {
			return $endpoints;
		}

		foreach ( array_keys( $endpoints ) as $route ) {
			if ( 0 === strpos( $route, '/wp/v2/users' ) ) {
				unset( $endpoints[ $route ] );
			}
		}

		return $endpoints;
	}

	/**
	 * 作者归档和 ?author=N 泄露的是同一批用户名，只堵 REST 端点等于没堵。
	 * headless 站不使用 WordPress 前台，直接 404。
	 */
	public static function block_author_enumeration() {
		if ( is_user_logged_in() ) {
			return;
		}

		if ( ! is_author() && ! isset( $_GET['author'] ) ) {
			return;
		}

		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}

	public static function enforce_read_only( $result, WP_REST_Server $server, WP_REST_Request $request ) {
		if ( ! self::is_public_route( $request->get_route() ) ) {
			return $result;
		}

		if ( in_array( $request->get_method(), array( 'GET', 'OPTIONS' ), true ) ) {
			return $result;
		}

		// 询盘是这个命名空间里唯一的写入口，鉴权在它自己的 permission_callback 里做。
		if ( self::is_inquiry_route( $request->get_route() ) ) {
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

	private static function is_inquiry_route( $route ) {
		$inquiry = '/' . YANXINNA_Headless_REST::NAMESPACE . YANXINNA_Headless_Inquiry::ROUTE;

		return untrailingslashit( (string) $route ) === $inquiry;
	}
}
