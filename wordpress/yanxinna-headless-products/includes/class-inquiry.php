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
				/*
				 * 必须给询盘独立的权限类型。不写这行会退回默认的 'post'，
				 * 于是「看询盘」需要通用的 edit_posts —— 而产品经理角色没有它，
				 * 商家登进去根本看不到询盘菜单（2026-08-04 实测确认）。
				 * 反过来给角色加 edit_posts 更糟：等于顺带开放整个 WordPress 的文章和页面。
				 */
				'capability_type'     => array( 'yx_inquiry', 'yx_inquiries' ),
				// 询盘是收到的记录，不允许在后台手工新建，避免和真实线索混淆。
				'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'        => true,
			)
		);
	}

	/**
	 * 询盘相关权限，由 YANXINNA_Headless_Content::install_roles() 一起装。
	 * 放在这里是为了和上面的 capability_type 待在同一个文件，改一处不会漏另一处。
	 *
	 * 没有 publish_ 权限：询盘由前端 REST 写入（wp_insert_post 不校验权限），
	 * 后台建新询盘本来就被 create_posts => do_not_allow 挡着。
	 */
	public static function capabilities() {
		return array(
			'edit_yx_inquiry',
			'read_yx_inquiry',
			'delete_yx_inquiry',
			'edit_yx_inquiries',
			'edit_others_yx_inquiries',
			'edit_published_yx_inquiries',
			'read_private_yx_inquiries',
			'delete_yx_inquiries',
			'delete_others_yx_inquiries',
			'delete_published_yx_inquiries',
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

		self::notify(
			$post_id,
			array(
				'name'    => $name,
				'email'   => $email,
				'phone'   => $phone,
				'subject' => $subject,
				'source'  => $source,
				'locale'  => $locale,
				'message' => $message,
				'product' => $product,
			)
		);

		return new WP_REST_Response( array( 'ok' => true ), 201 );
	}

	/**
	 * 新询盘邮件提醒。没有这封信，商家不主动登后台就永远不知道有客户来问。
	 *
	 * 发信失败绝不能影响客户那边的提交结果——询盘已经落库了，
	 * 提醒发不出去是运营问题，不是数据问题。所以只写日志、不改返回值。
	 *
	 * ponytail: 同步发信，会给提交请求加 1-3 秒（SMTP 握手）。
	 * 慢到影响体验再改成挂 shutdown 或进队列。
	 */
	private static function notify( $post_id, array $fields ) {
		$to = sanitize_email( (string) get_option( 'admin_email' ) );
		if ( ! $to || ! is_email( $to ) ) {
			return;
		}

		$labels = array(
			'name'    => '姓名',
			'email'   => '邮箱',
			'phone'   => '电话',
			'subject' => '主题',
			'source'  => '来源',
			'locale'  => '语言',
		);

		$lines = array();
		foreach ( $labels as $key => $label ) {
			if ( '' !== (string) $fields[ $key ] ) {
				$lines[] = sprintf( '%s：%s', $label, $fields[ $key ] );
			}
		}

		foreach ( array( 'number' => '产品编号', 'name' => '产品名称', 'color' => '颜色', 'size' => '尺码' ) as $key => $label ) {
			if ( '' !== (string) $fields['product'][ $key ] ) {
				$lines[] = sprintf( '%s：%s', $label, $fields['product'][ $key ] );
			}
		}

		$lines[] = '';
		$lines[] = '留言：';
		$lines[] = $fields['message'];
		$lines[] = '';
		$lines[] = '后台查看：' . admin_url( 'post.php?post=' . (int) $post_id . '&action=edit' );

		$subject = sprintf( '[YANXINNA] 新询盘 — %s', $fields['name'] );
		$body    = implode( "\n", $lines );
		$headers = array( 'Content-Type: text/plain; charset=UTF-8' );

		if ( wp_mail( $to, $subject, $body, $headers ) ) {
			return;
		}

		/*
		 * 2026-08-04 实测出现过一次瞬时失败（同一天另外 4 次全成功，原因没复现）。
		 * 询盘本身已经落库，丢的只是提醒——但商家不主动登后台就发现不了，值得重试一次。
		 * 真实原因下次靠 class-mail.php 的 wp_mail_failed 日志抓。
		 * ponytail: 只重试一次、同步等待；如果日志显示还在丢，再上队列或外部投递服务。
		 */
		sleep( 1 );
		$retried = wp_mail( $to, $subject, $body, $headers );

		error_log(
			sprintf(
				'YANXINNA: inquiry %d notification failed on first attempt, retry %s (SMTP configured: %s).',
				(int) $post_id,
				$retried ? 'succeeded' : 'FAILED',
				YANXINNA_Headless_Mail::is_configured() ? 'yes' : 'no'
			)
		);
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
