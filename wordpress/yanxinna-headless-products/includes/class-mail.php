<?php
/**
 * SMTP 发信。
 *
 * 这台服务器没有 MTA（`/usr/sbin/sendmail: No such file or directory`），
 * PHP 的 mail() 一律静默失败、不报错。连带三件事全废：
 * 忘记密码收不到重置信、新询盘没有提醒、建账号时发不出设密码链接。
 *
 * WordPress 自带 PHPMailer，接一个 phpmailer_init 就够，不需要额外装发信插件——
 * 这个站建完要交接给商家、之后没人维护，少一个会过期会更新的依赖就少一个坏点。
 *
 * 凭据只走 wp-config 常量（和 YANXINNA_REVALIDATE_SECRET 同一套做法），不入库、不进 Git。
 * 常量没配齐时这里什么都不做，退回原来的 mail()，不会把站点搞挂。
 *
 * @package yanxinna-headless-products
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class YANXINNA_Headless_Mail {

	const DEFAULT_HOST = 'smtp.139.com';

	/**
	 * 阿里云轻量默认封掉出站 25 和 587，实测只有 465 通（2026-08-04 于 47.243.151.206）。
	 * 465 是隐式 TLS，对应 PHPMailer 的 'ssl'，不是 STARTTLS。
	 */
	const DEFAULT_PORT = 465;

	public static function register() {
		add_action( 'phpmailer_init', array( __CLASS__, 'configure' ) );
		add_filter( 'wp_mail_from', array( __CLASS__, 'from_address' ) );
		add_filter( 'wp_mail_from_name', array( __CLASS__, 'from_name' ) );
		add_action( 'wp_mail_failed', array( __CLASS__, 'log_failure' ) );
	}

	/**
	 * 发信失败只有一个 false，不记下来就无从查起。
	 * 交接后商家发现"没收到询盘提醒"时，这行日志是唯一线索。
	 */
	public static function log_failure( $error ) {
		error_log( 'YANXINNA: wp_mail failed — ' . $error->get_error_message() );
	}

	public static function is_configured() {
		return '' !== self::username()
			&& defined( 'YANXINNA_SMTP_PASS' )
			&& '' !== (string) YANXINNA_SMTP_PASS;
	}

	private static function username() {
		return defined( 'YANXINNA_SMTP_USER' ) ? trim( (string) YANXINNA_SMTP_USER ) : '';
	}

	private static function port() {
		return defined( 'YANXINNA_SMTP_PORT' ) ? (int) YANXINNA_SMTP_PORT : self::DEFAULT_PORT;
	}

	public static function configure( $phpmailer ) {
		if ( ! self::is_configured() ) {
			return;
		}

		$port = self::port();

		$phpmailer->isSMTP();
		$phpmailer->Host       = defined( 'YANXINNA_SMTP_HOST' ) ? (string) YANXINNA_SMTP_HOST : self::DEFAULT_HOST;
		$phpmailer->Port       = $port;
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = self::username();
		$phpmailer->Password   = (string) YANXINNA_SMTP_PASS;
		$phpmailer->SMTPSecure = 465 === $port ? 'ssl' : 'tls';
		$phpmailer->CharSet    = 'UTF-8';
	}

	/**
	 * 139 邮箱要求信封发件人和认证账号一致，写别的地址整封退信。
	 */
	public static function from_address( $from ) {
		return self::is_configured() ? self::username() : $from;
	}

	public static function from_name( $name ) {
		return self::is_configured() ? 'YANXINNA' : $name;
	}
}
