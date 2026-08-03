<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 询盘收集：前端表单经 Next 服务端转发到这里，落成后台可读的记录。
 *
 * 只接受带共享密钥的服务端请求，浏览器拿不到密钥，所以不开 CORS。
 */
final class YANXINNA_Headless_Inquiry {
	const POST_TYPE = 'yx_inquiry';
	const ROUTE     = '/inquiries';

	const RATE_LIMIT_MAX     = 5;
	const RATE_LIMIT_WINDOW  = 600;
	const MAX_NAME_LENGTH    = 100;
	const MAX_EMAIL_LENGTH   = 200;
	const MAX_PHONE_LENGTH   = 50;
	const MAX_MESSAGE_LENGTH = 5000;
	const MAX_SHORT_LENGTH   = 200;

	private static $subjects = array( 'oem', 'product', 'sample', 'other' );

	public static function register() {
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( __CLASS__, 'admin_columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( __CLASS__, 'render_admin_column' ), 10, 2 );
	}

	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => '询盘',
					'singular_name' => '询盘',
					'menu_name'     => '询盘',
					'all_items'     => '所有询盘',
					'edit_item'     => '询盘详情',
					'search_items'  => '搜索询盘',
					'not_found'     => '还没有收到询盘。',
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_rest'        => false,
				'supports'            => array( 'title', 'editor' ),
				'menu_icon'           => 'dashicons-email-alt',
				'has_archive'         => false,
				'rewrite'             => false,
				'exclude_from_search' => true,
				// 询盘是收到的记录，不允许在后台手工新建，避免和真实线索混淆。
				'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'        => true,
			)
		);
	}

	public static function register_routes() {
		register_rest_route(
			YANXINNA_Headless_REST::NAMESPACE,
			self::ROUTE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'create_inquiry' ),
				'permission_callback' => array( __CLASS__, 'check_secret' ),
			)
		);
	}

	/**
	 * 只有握着共享密钥的服务端才能提交。密钥复用 YANXINNA_REVALIDATE_SECRET，
	 * 少一个要同步的配置项；两个用途的权限都只是"写入非敏感数据"。
	 */
	public static function check_secret( WP_REST_Request $request ) {
		if ( ! defined( 'YANXINNA_REVALIDATE_SECRET' ) || ! YANXINNA_REVALIDATE_SECRET ) {
			return new WP_Error(
				'yanxinna_inquiry_unconfigured',
				__( 'Inquiry endpoint is not configured.', 'yanxinna-headless-products' ),
				array( 'status' => 503 )
			);
		}

		$provided = (string) $request->get_header( 'x-yanxinna-secret' );
		$expected = (string) YANXINNA_REVALIDATE_SECRET;

		if ( strlen( $provided ) !== strlen( $expected ) || ! hash_equals( $expected, $provided ) ) {
			return new WP_Error(
				'yanxinna_inquiry_forbidden',
				__( 'Invalid credentials.', 'yanxinna-headless-products' ),
				array( 'status' => 401 )
			);
		}

		return true;
	}

	public static function create_inquiry( WP_REST_Request $request ) {
		$body = $request->get_json_params();
		if ( ! is_array( $body ) ) {
			return self::bad_request( __( 'Malformed request body.', 'yanxinna-headless-products' ) );
		}

		// 蜜罐：真人看不到这个字段，填了就是脚本。
		if ( '' !== trim( (string) ( $body['website'] ?? '' ) ) ) {
			return new WP_REST_Response( array( 'ok' => true ), 201 );
		}

		$limit = self::check_rate_limit( $request );
		if ( is_wp_error( $limit ) ) {
			return $limit;
		}

		$name    = self::clean_text( $body['name'] ?? '', self::MAX_NAME_LENGTH );
		$email   = sanitize_email( substr( trim( (string) ( $body['email'] ?? '' ) ), 0, self::MAX_EMAIL_LENGTH ) );
		$message = self::clean_textarea( $body['message'] ?? '', self::MAX_MESSAGE_LENGTH );

		if ( '' === $name ) {
			return self::bad_request( __( 'Name is required.', 'yanxinna-headless-products' ) );
		}
		if ( '' === $email || ! is_email( $email ) ) {
			return self::bad_request( __( 'A valid email is required.', 'yanxinna-headless-products' ) );
		}
		if ( '' === $message ) {
			return self::bad_request( __( 'Message is required.', 'yanxinna-headless-products' ) );
		}

		$phone   = self::clean_text( $body['phone'] ?? '', self::MAX_PHONE_LENGTH );
		$subject = sanitize_key( (string) ( $body['subject'] ?? '' ) );
		if ( ! in_array( $subject, self::$subjects, true ) ) {
			$subject = 'other';
		}

		$source  = 'product' === sanitize_key( (string) ( $body['source'] ?? '' ) ) ? 'product' : 'contact';
		$locale  = self::clean_text( $body['locale'] ?? '', 10 );
		$product = array(
			'name'   => self::clean_text( $body['product_name'] ?? '', self::MAX_SHORT_LENGTH ),
			'number' => self::clean_text( $body['product_number'] ?? '', self::MAX_SHORT_LENGTH ),
			'color'  => self::clean_text( $body['product_color'] ?? '', self::MAX_SHORT_LENGTH ),
			'size'   => self::clean_text( $body['product_size'] ?? '', self::MAX_SHORT_LENGTH ),
		);

		$title = '' !== $product['number']
			? sprintf( '%s — %s', $name, $product['number'] )
			: sprintf( '%s — %s', $name, $subject );

		$post_id = wp_insert_post(
			array(
				'post_type'    => self::POST_TYPE,
				'post_status'  => 'publish',
				'post_title'   => $title,
				'post_content' => $message,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return new WP_Error(
				'yanxinna_inquiry_failed',
				__( 'Could not save the inquiry.', 'yanxinna-headless-products' ),
				array( 'status' => 500 )
			);
		}

		update_post_meta( $post_id, '_yx_email', $email );
		update_post_meta( $post_id, '_yx_phone', $phone );
		update_post_meta( $post_id, '_yx_subject', $subject );
		update_post_meta( $post_id, '_yx_source', $source );
		update_post_meta( $post_id, '_yx_locale', $locale );
		foreach ( $product as $key => $value ) {
			if ( '' !== $value ) {
				update_post_meta( $post_id, '_yx_product_' . $key, $value );
			}
		}

		return new WP_REST_Response( array( 'ok' => true ), 201 );
	}

	private static function check_rate_limit( WP_REST_Request $request ) {
		// 请求由 Next 服务端转发，来源 IP 在这个头里；取不到就退回连接 IP。
		$forwarded = (string) $request->get_header( 'x-forwarded-for' );
		$ip        = $forwarded ? trim( explode( ',', $forwarded )[0] ) : (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );
		$key       = 'yx_inq_' . md5( $ip );
		$hits      = (int) get_transient( $key );

		if ( $hits >= self::RATE_LIMIT_MAX ) {
			return new WP_Error(
				'yanxinna_inquiry_rate_limited',
				__( 'Too many inquiries. Please try again later.', 'yanxinna-headless-products' ),
				array( 'status' => 429 )
			);
		}

		set_transient( $key, $hits + 1, self::RATE_LIMIT_WINDOW );

		return true;
	}

	private static function clean_text( $value, $max ) {
		return substr( sanitize_text_field( (string) $value ), 0, $max );
	}

	private static function clean_textarea( $value, $max ) {
		return substr( sanitize_textarea_field( (string) $value ), 0, $max );
	}

	private static function bad_request( $message ) {
		return new WP_Error( 'yanxinna_inquiry_invalid', $message, array( 'status' => 400 ) );
	}

	public static function admin_columns( $columns ) {
		$date = isset( $columns['date'] ) ? $columns['date'] : '';
		unset( $columns['date'] );

		$columns['yx_email']   = '邮箱';
		$columns['yx_phone']   = '电话';
		$columns['yx_subject'] = '主题';
		$columns['yx_product'] = '关联产品';
		$columns['date']       = $date;

		return $columns;
	}

	public static function render_admin_column( $column, $post_id ) {
		switch ( $column ) {
			case 'yx_email':
				$email = (string) get_post_meta( $post_id, '_yx_email', true );
				if ( $email ) {
					printf( '<a href="mailto:%1$s">%1$s</a>', esc_attr( $email ) );
				}
				break;
			case 'yx_phone':
				echo esc_html( (string) get_post_meta( $post_id, '_yx_phone', true ) );
				break;
			case 'yx_subject':
				echo esc_html( (string) get_post_meta( $post_id, '_yx_subject', true ) );
				break;
			case 'yx_product':
				$number = (string) get_post_meta( $post_id, '_yx_product_number', true );
				$name   = (string) get_post_meta( $post_id, '_yx_product_name', true );
				echo esc_html( trim( $number . ' ' . $name ) );
				break;
		}
	}
}
