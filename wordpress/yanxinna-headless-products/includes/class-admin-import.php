<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 后台「产品 → 批量导入」页：传一张中文 CSV + 一个图片压缩包，
 * 逐个产品生成五语文案、压图、入库。给没有命令行、没有 Claude 的商家用。
 *
 * 流程：上传（admin-post）→ 建任务目录（系统临时目录，不对外可见）→ 页面上的脚本
 * 一次一个产品地调 AJAX（每个产品一次 AI 调用，约 30–60 秒）→ 完成后删掉图片。
 */
final class YANXINNA_Headless_Admin_Import {
	const CAP       = 'edit_yx_products';
	const PAGE      = 'yx-batch-import';
	const NONCE     = 'yx_batch_import';
	const UPLOAD    = 'yx_batch_import_upload';
	const STEP      = 'yx_batch_import_step';
	const SETTINGS  = 'yx_ai_settings';
	const COLUMNS   = array(
		'产品编号'  => 'product_number',
		'中文名'   => 'name_zh',
		'大类'    => 'category',
		'子类'    => 'subcategory',
		'尺码'    => 'sizes',
		'颜色'    => 'colors',
		'面料'    => 'fabric_zh',
		'洗护'    => 'care_zh',
		'压缩等级'  => 'compression_level',
		'卖点'    => 'benefits_zh',
		'首页推荐'  => 'featured',
		'热销'    => 'best_seller',
		'排序'    => 'sort_order',
		'图片文件夹' => 'image_dir',
	);
	const IMAGE_EXT = array( 'png', 'jpg', 'jpeg', 'webp' );

	public static function register() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_' . self::UPLOAD, array( __CLASS__, 'handle_upload' ) );
		add_action( 'admin_post_' . self::SETTINGS, array( __CLASS__, 'handle_settings' ) );
		add_action( 'wp_ajax_' . self::STEP, array( __CLASS__, 'ajax_step' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=' . YANXINNA_Headless_Content::POST_TYPE,
			'批量导入产品',
			'批量导入',
			self::CAP,
			self::PAGE,
			array( __CLASS__, 'render' )
		);
	}

	private static function page_url( array $args = array() ) {
		return add_query_arg(
			array_merge(
				array(
					'post_type' => YANXINNA_Headless_Content::POST_TYPE,
					'page'      => self::PAGE,
				),
				$args
			),
			admin_url( 'edit.php' )
		);
	}

	// ---------- 页面 ----------

	public static function render() {
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( '没有权限。' );
		}
		$job_id = isset( $_GET['job'] ) ? self::sanitize_job_id( wp_unslash( $_GET['job'] ) ) : '';
		$job    = $job_id ? self::load_job( $job_id ) : null;

		echo '<div class="wrap"><h1>批量导入产品</h1>';
		if ( $job ) {
			self::render_job( $job );
		} else {
			self::render_form();
		}
		echo '</div>';
	}

	private static function render_form() {
		if ( isset( $_GET['error'] ) ) {
			printf( '<div class="notice notice-error"><p>%s</p></div>', esc_html( sanitize_text_field( wp_unslash( $_GET['error'] ) ) ) );
		}
		if ( isset( $_GET['saved'] ) ) {
			echo '<div class="notice notice-success is-dismissible"><p>AI 接口设置已保存。</p></div>';
		}
		if ( ! YANXINNA_Headless_AI::is_available() ) {
			echo '<div class="notice notice-warning"><p>还没有配置 AI 接口：管理员在下面填一个 OpenAI 兼容接口，或到「设置 → Connectors」配官方供应商，之后才能生成文案。</p></div>';
		}
		self::render_settings();
		?>
		<p>一张 CSV 一行一个产品，只填中文；图片按产品分文件夹打成一个 ZIP。导入时会自动写五种语言的文案、压缩图片并入库。</p>
		<form method="post" enctype="multipart/form-data" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="<?php echo esc_attr( self::UPLOAD ); ?>">
			<?php wp_nonce_field( self::NONCE ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="yx-csv">产品表（CSV）</label></th>
					<td>
						<input type="file" id="yx-csv" name="csv" accept=".csv,text/csv" required>
						<p class="description">用 Excel 填模板后「另存为 → CSV UTF-8」。列说明见 wordpress/migration/填写说明.md。</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="yx-zip">图片压缩包（ZIP）</label></th>
					<td>
						<input type="file" id="yx-zip" name="zip" accept=".zip,application/zip" required>
						<p class="description">压缩包里一个产品一个文件夹，文件夹名填在 CSV 的「图片文件夹」列。图片按「黑色白底.png」「黑色模特正面.png」命名，其余文件进详情图集。最大 50MB，图片多就分批。</p>
					</td>
				</tr>
				<tr>
					<th scope="row">导入后</th>
					<td><label><input type="checkbox" name="publish" value="1" checked> 直接发布（不勾则进草稿，检查后再发布）</label></td>
				</tr>
			</table>
			<p class="submit"><button type="submit" class="button button-primary">开始导入</button></p>
		</form>
		<?php
	}

	/** 第三方（OpenAI 兼容）接口设置，只有管理员看得到；key 存在数据库选项里，页面上不回显。 */
	private static function render_settings() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$has_key = '' !== trim( (string) get_option( YANXINNA_Headless_AI::OPTION_API_KEY ) );
		?>
		<h2>AI 接口设置</h2>
		<p>当前：<?php echo esc_html( YANXINNA_Headless_AI::backend_label() ); ?>。</p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="<?php echo esc_attr( self::SETTINGS ); ?>">
			<?php wp_nonce_field( self::SETTINGS ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="yx-ai-base">接口地址</label></th>
					<td>
						<input type="url" id="yx-ai-base" name="base_url" class="regular-text" value="<?php echo esc_attr( get_option( YANXINNA_Headless_AI::OPTION_BASE_URL ) ); ?>" placeholder="https://api.deepseek.com/v1">
						<p class="description">OpenAI 兼容接口，填到 /v1 这一级（中转站、DeepSeek、智谱等）。留空则改走「设置 → Connectors」。</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="yx-ai-key">API key</label></th>
					<td>
						<input type="password" id="yx-ai-key" name="api_key" class="regular-text" autocomplete="new-password" placeholder="<?php echo $has_key ? '已保存，留空表示不改' : 'sk-…'; ?>">
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="yx-ai-model">模型名</label></th>
					<td>
						<input type="text" id="yx-ai-model" name="model" class="regular-text" value="<?php echo esc_attr( get_option( YANXINNA_Headless_AI::OPTION_MODEL ) ); ?>" placeholder="deepseek-chat">
						<p class="description">按接口商给的模型名填。俄语是主市场，建议先导一个产品看看俄语文案再定。</p>
					</td>
				</tr>
			</table>
			<p class="submit"><button type="submit" class="button">保存接口设置</button></p>
		</form>
		<hr>
		<?php
	}

	public static function handle_settings() {
		check_admin_referer( self::SETTINGS );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( '没有权限。' );
		}
		update_option( YANXINNA_Headless_AI::OPTION_BASE_URL, esc_url_raw( trim( (string) wp_unslash( $_POST['base_url'] ?? '' ) ) ), false );
		update_option( YANXINNA_Headless_AI::OPTION_MODEL, sanitize_text_field( wp_unslash( $_POST['model'] ?? '' ) ), false );
		$key = trim( (string) wp_unslash( $_POST['api_key'] ?? '' ) );
		if ( '' !== $key ) {
			update_option( YANXINNA_Headless_AI::OPTION_API_KEY, sanitize_text_field( $key ), false );
		}
		wp_safe_redirect( self::page_url( array( 'saved' => 1 ) ) );
		exit;
	}

	private static function render_job( array $job ) {
		$pending = 0;
		foreach ( $job['rows'] as $row ) {
			if ( 'pending' === $row['state'] ) {
				++$pending;
			}
		}
		?>
		<p>任务 <code><?php echo esc_html( $job['id'] ); ?></code>，导入后<?php echo 'publish' === $job['status'] ? '直接发布' : '进草稿'; ?>。
			<span id="yx-status"><?php echo $pending ? '正在处理，请不要关闭本页…' : '已完成。'; ?></span>
			<a href="<?php echo esc_url( self::page_url() ); ?>">再导一批</a>
		</p>
		<table class="widefat striped" id="yx-rows">
			<thead><tr><th>产品编号</th><th>中文名</th><th>状态</th><th>结果</th></tr></thead>
			<tbody>
			<?php foreach ( $job['rows'] as $index => $row ) : ?>
				<tr data-index="<?php echo (int) $index; ?>">
					<td><?php echo esc_html( $row['product_number'] ?? '?' ); ?></td>
					<td><?php echo esc_html( $row['name_zh'] ?? '' ); ?></td>
					<td class="yx-state"><?php echo esc_html( self::state_label( $row['state'] ) ); ?></td>
					<td class="yx-result"><?php echo wp_kses_post( self::result_html( $row ) ); ?></td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<p><button type="button" class="button" id="yx-retry" style="display:none">重试失败的产品</button></p>
		<script>
		(function () {
			var job = <?php echo wp_json_encode( $job['id'] ); ?>;
			var nonce = <?php echo wp_json_encode( wp_create_nonce( self::NONCE ) ); ?>;
			var status = document.getElementById('yx-status');
			var retry = document.getElementById('yx-retry');
			var labels = <?php echo wp_json_encode( self::state_labels() ); ?>;
			function paint(row) {
				var tr = document.querySelector('#yx-rows tr[data-index="' + row.index + '"]');
				if (!tr) return;
				tr.querySelector('.yx-state').textContent = labels[row.state] || row.state;
				tr.querySelector('.yx-result').innerHTML = row.result_html;
			}
			function step(doRetry) {
				var body = new FormData();
				body.append('action', <?php echo wp_json_encode( self::STEP ); ?>);
				body.append('_ajax_nonce', nonce);
				body.append('job', job);
				if (doRetry) body.append('retry', '1');
				status.textContent = '正在处理，请不要关闭本页…';
				retry.style.display = 'none';
				fetch(ajaxurl, { method: 'POST', credentials: 'same-origin', body: body })
					.then(function (r) { return r.json(); })
					.then(function (data) {
						if (!data.success) { status.textContent = '出错：' + (data.data || '未知错误'); return; }
						if (data.data.row) paint(data.data.row);
						if (data.data.remaining > 0) { step(false); return; }
						status.textContent = '已完成：成功 ' + data.data.done + '，失败 ' + data.data.failed + '。';
						if (data.data.failed > 0) retry.style.display = '';
					})
					.catch(function (e) { status.textContent = '网络出错：' + e; retry.style.display = ''; });
			}
			retry.addEventListener('click', function () { step(true); });
			<?php if ( $pending ) : ?>step(false);<?php endif; ?>
		})();
		</script>
		<?php
	}

	private static function state_labels() {
		return array(
			'pending' => '等待',
			'running' => '处理中…',
			'done'    => '完成',
			'failed'  => '失败',
		);
	}

	private static function state_label( $state ) {
		$labels = self::state_labels();
		return $labels[ $state ] ?? $state;
	}

	private static function result_html( array $row ) {
		if ( 'done' === $row['state'] ) {
			$edit  = get_edit_post_link( (int) $row['post_id'], '' );
			$links = array( sprintf( '<a href="%s">后台编辑</a>', esc_url( $edit ) ) );
			if ( defined( 'YANXINNA_FRONTEND_URL' ) && 'publish' === ( $row['post_status'] ?? '' ) ) {
				$links[] = sprintf( '<a href="%s" target="_blank" rel="noopener">网站页面</a>', esc_url( rtrim( YANXINNA_FRONTEND_URL, '/' ) . '/product/' . $row['slug'] ) );
			}
			return esc_html( 'created' === ( $row['action'] ?? '' ) ? '新建' : '更新' ) . ' · ' . implode( ' · ', $links );
		}
		return esc_html( (string) ( $row['message'] ?? '' ) );
	}

	// ---------- 上传 ----------

	public static function handle_upload() {
		check_admin_referer( self::NONCE );
		if ( ! current_user_can( self::CAP ) ) {
			wp_die( '没有权限。' );
		}

		try {
			foreach ( array( 'csv', 'zip' ) as $key ) {
				if ( empty( $_FILES[ $key ]['tmp_name'] ) || ! empty( $_FILES[ $key ]['error'] ) ) {
					throw new RuntimeException( "请选择{$key}文件（上传失败或超过大小限制）。" );
				}
			}

			$job_id = strtolower( wp_generate_password( 16, false ) );
			$dir    = self::job_dir( $job_id );
			if ( ! wp_mkdir_p( $dir . '/media' ) ) {
				throw new RuntimeException( '临时目录不可写：' . $dir );
			}
			if ( ! move_uploaded_file( $_FILES['csv']['tmp_name'], $dir . '/upload.csv' ) ) {
				throw new RuntimeException( '保存 CSV 失败。' );
			}

			require_once ABSPATH . 'wp-admin/includes/file.php';
			WP_Filesystem();
			$unzipped = unzip_file( $_FILES['zip']['tmp_name'], $dir . '/media' );
			if ( is_wp_error( $unzipped ) ) {
				throw new RuntimeException( '解压失败：' . $unzipped->get_error_message() );
			}

			$rows = self::parse_csv( $dir . '/upload.csv' );
			if ( ! $rows ) {
				throw new RuntimeException( 'CSV 里没有产品行。' );
			}

			$job = array(
				'id'      => $job_id,
				'status'  => ! empty( $_POST['publish'] ) ? 'publish' : 'draft',
				'created' => time(),
				'rows'    => array(),
			);
			foreach ( $rows as $row ) {
				$job['rows'][] = array_merge(
					$row,
					array(
						'state'   => isset( $row['error'] ) ? 'failed' : 'pending',
						'message' => $row['error'] ?? '',
						'post_id' => 0,
						'slug'    => '',
					)
				);
			}
			self::save_job( $job );
		} catch ( Throwable $error ) {
			wp_safe_redirect( self::page_url( array( 'error' => $error->getMessage() ) ) );
			exit;
		}

		wp_safe_redirect( self::page_url( array( 'job' => $job_id ) ) );
		exit;
	}

	// ---------- 逐个处理 ----------

	public static function ajax_step() {
		check_ajax_referer( self::NONCE );
		if ( ! current_user_can( self::CAP ) ) {
			wp_send_json_error( '没有权限。' );
		}
		$job_id = isset( $_POST['job'] ) ? self::sanitize_job_id( wp_unslash( $_POST['job'] ) ) : '';
		$job    = $job_id ? self::load_job( $job_id ) : null;
		if ( ! $job ) {
			wp_send_json_error( '任务不存在或已过期，请重新上传。' );
		}

		if ( ! empty( $_POST['retry'] ) ) {
			foreach ( $job['rows'] as &$row ) {
				if ( 'failed' === $row['state'] && empty( $row['error'] ) ) {
					$row['state']   = 'pending';
					$row['message'] = '';
				}
			}
			unset( $row );
		}

		$index = null;
		foreach ( $job['rows'] as $i => $row ) {
			if ( 'pending' === $row['state'] ) {
				$index = $i;
				break;
			}
		}

		$payload = array( 'row' => null );
		if ( null !== $index ) {
			$job['rows'][ $index ]['state'] = 'running';
			self::save_job( $job );

			set_time_limit( 300 );
			try {
				$result                              = self::process_row( $job, $job['rows'][ $index ] );
				$job['rows'][ $index ]['state']       = 'done';
				$job['rows'][ $index ]['post_id']     = $result['id'];
				$job['rows'][ $index ]['slug']        = $result['slug'];
				$job['rows'][ $index ]['action']      = $result['action'];
				$job['rows'][ $index ]['post_status'] = $job['status'];
				$job['rows'][ $index ]['message']     = '';
			} catch ( Throwable $error ) {
				$job['rows'][ $index ]['state']   = 'failed';
				$job['rows'][ $index ]['message'] = $error->getMessage();
			}
			self::save_job( $job );
			$payload['row'] = array(
				'index'       => $index,
				'state'       => $job['rows'][ $index ]['state'],
				'result_html' => self::result_html( $job['rows'][ $index ] ),
			);
		}

		$counts = array( 'pending' => 0, 'done' => 0, 'failed' => 0 );
		foreach ( $job['rows'] as $row ) {
			if ( isset( $counts[ $row['state'] ] ) ) {
				++$counts[ $row['state'] ];
			}
		}
		if ( 0 === $counts['pending'] ) {
			self::remove_dir( self::job_dir( $job_id ) . '/media' );
			self::remove_dir( self::job_dir( $job_id ) . '/converted' );
		}

		wp_send_json_success(
			$payload + array(
				'remaining' => $counts['pending'],
				'done'      => $counts['done'],
				'failed'    => $counts['failed'],
			)
		);
	}

	private static function process_row( array $job, array $row ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$job_dir   = self::job_dir( $job['id'] );
		$image_dir = self::find_dir( $job_dir . '/media', $row['image_dir'] );
		if ( ! $image_dir ) {
			throw new RuntimeException( '压缩包里找不到文件夹「' . $row['image_dir'] . '」。' );
		}
		$files   = self::list_images( $image_dir );
		$matched = self::match_images( array_keys( $files ), $row['colors'] );

		$copy = YANXINNA_Headless_AI::generate(
			array(
				'product_number'    => $row['product_number'],
				'name_zh'           => $row['name_zh'],
				'category'          => $row['category'],
				'subcategory'       => $row['subcategory'],
				'sizes'             => $row['sizes'],
				'colors_zh'         => array_column( $row['colors'], 'name_zh' ),
				'fabric_zh'         => $row['fabric_zh'],
				'care_zh'           => $row['care_zh'],
				'compression_level' => $row['compression_level'],
				'benefits_zh'       => $row['benefits_zh'],
			)
		);
		if ( is_wp_error( $copy ) ) {
			throw new RuntimeException( '生成文案失败：' . $copy->get_error_message() );
		}

		$pn    = $row['product_number'];
		$lower = strtolower( $pn );
		$out   = $job_dir . '/converted/' . $pn;
		wp_mkdir_p( $out );

		$colors  = array();
		$gallery = array();
		foreach ( $matched['colors'] as $i => $color ) {
			$base  = $lower . '-' . ( sanitize_title( $copy['colors'][ $i ]['en-US'] ) ?: 'c' . ( $i + 1 ) );
			$image = self::convert_image( $files[ $color['image'] ], $out . '/' . $base . '-main.jpg' );
			$hover = self::convert_image( $files[ $color['hover_image'] ], $out . '/' . $base . '-hover.jpg' );
			$colors[]  = array(
				'hex'         => $color['hex'],
				'image'       => $image,
				'hover_image' => $hover,
				'names'       => $copy['colors'][ $i ],
			);
			$gallery[] = $image;
			$gallery[] = $hover;
		}
		foreach ( $matched['extras'] as $i => $file ) {
			$gallery[] = self::convert_image( $files[ $file ], $out . '/' . $lower . '-detail-' . sprintf( '%02d', $i + 1 ) . '.jpg' );
		}

		$item = array(
			'product_number'    => $pn,
			'slug'              => sanitize_title( $copy['translations']['en-US']['name'] ) ?: $lower,
			'category'          => $row['category'],
			'subcategory'       => $row['subcategory'],
			'main_image'        => $colors[0]['image'],
			'hover_image'       => $colors[0]['hover_image'],
			'gallery'           => $gallery,
			'sizes'             => $row['sizes'],
			'colors'            => $colors,
			'parameters'        => array(),
			'attachments'       => array(),
			'compression_level' => $row['compression_level'],
			'featured'          => $row['featured'],
			'best_seller'       => $row['best_seller'],
			'sort_order'        => $row['sort_order'],
			'complete_the_look' => array(),
			'translations'      => $copy['translations'],
		);

		$importer = new YANXINNA_Headless_Importer(
			array(
				'media_dir' => $job_dir . '/converted',
				'status'    => $job['status'],
			)
		);
		$summary  = $importer->import_items( array( $item ) );
		$result   = $summary['results'][0] ?? array();
		if ( ! empty( $result['error'] ) ) {
			throw new RuntimeException( $result['error'] );
		}
		return $result;
	}

	/** 压成最长边 1200×1600 以内的 JPG，返回相对 converted/ 的路径。 */
	private static function convert_image( $src, $dest ) {
		$editor = wp_get_image_editor( $src );
		if ( is_wp_error( $editor ) ) {
			throw new RuntimeException( '读不了图片 ' . basename( $src ) . '：' . $editor->get_error_message() );
		}
		$editor->resize( 1200, 1600, false );
		$editor->set_quality( 85 );
		$saved = $editor->save( $dest, 'image/jpeg' );
		if ( is_wp_error( $saved ) ) {
			throw new RuntimeException( '压图失败 ' . basename( $src ) . '：' . $saved->get_error_message() );
		}
		return basename( dirname( $saved['path'] ) ) . '/' . basename( $saved['path'] );
	}

	// ---------- CSV（和 scripts/import-products.mjs 同一套规则）----------

	public static function parse_csv( $path ) {
		$text = (string) file_get_contents( $path );
		$text = preg_replace( '/^\xEF\xBB\xBF/', '', $text );
		if ( ! mb_check_encoding( $text, 'UTF-8' ) ) {
			$text = mb_convert_encoding( $text, 'UTF-8', 'GB18030' ); // Excel 直接存的 CSV 是 GBK
		}

		$stream = fopen( 'php://temp', 'r+' );
		fwrite( $stream, $text );
		rewind( $stream );

		$header = fgetcsv( $stream, 0, ',', '"', '\\' );
		if ( ! $header ) {
			throw new RuntimeException( 'CSV 是空的。' );
		}
		$header  = array_map( 'trim', $header );
		$missing = array_diff( array_keys( self::COLUMNS ), $header );
		if ( $missing ) {
			throw new RuntimeException( 'CSV 表头缺少：' . implode( '、', $missing ) );
		}

		$rows = array();
		$seen = array();
		while ( ( $cells = fgetcsv( $stream, 0, ',', '"', '\\' ) ) !== false ) {
			if ( ! array_filter( array_map( 'trim', $cells ) ) ) {
				continue;
			}
			$record = array();
			foreach ( $header as $i => $name ) {
				if ( isset( self::COLUMNS[ $name ] ) ) {
					$record[ self::COLUMNS[ $name ] ] = $cells[ $i ] ?? '';
				}
			}
			$row = self::parse_row( $record );
			if ( ! isset( $row['error'] ) ) {
				if ( isset( $seen[ $row['product_number'] ] ) ) {
					$row['error'] = '产品编号重复：' . $row['product_number'];
				}
				$seen[ $row['product_number'] ] = true;
			}
			$rows[] = $row;
		}
		fclose( $stream );
		return $rows;
	}

	public static function parse_row( array $record ) {
		$get   = function ( $key ) use ( $record ) {
			return trim( (string) ( $record[ $key ] ?? '' ) );
		};
		$split = function ( $value, $sep ) {
			return array_values( array_filter( array_map( 'trim', explode( $sep, $value ) ) ) );
		};
		$yes   = function ( $value ) {
			return in_array( strtolower( trim( $value ) ), array( '是', 'y', 'yes', 'true', '1' ), true );
		};
		$pn    = $get( 'product_number' ) ?: '?';
		$fail  = function ( $message ) use ( $record, $pn ) {
			return array(
				'product_number' => $pn,
				'name_zh'        => trim( (string) ( $record['name_zh'] ?? '' ) ),
				'error'          => $message,
			);
		};

		foreach ( array( 'product_number' => '产品编号', 'name_zh' => '中文名', 'category' => '大类', 'subcategory' => '子类', 'sizes' => '尺码', 'colors' => '颜色', 'fabric_zh' => '面料', 'image_dir' => '图片文件夹' ) as $key => $label ) {
			if ( '' === $get( $key ) ) {
				return $fail( "「{$label}」必填" );
			}
		}

		$colors = array();
		foreach ( $split( $get( 'colors' ), '|' ) as $entry ) {
			if ( ! preg_match( '/^(.+?)\s+(#[0-9a-fA-F]{6})$/u', $entry, $m ) ) {
				return $fail( "颜色「{$entry}」格式应为「中文色名 #RRGGBB」" );
			}
			$colors[] = array(
				'name_zh' => $m[1],
				'hex'     => strtolower( $m[2] ),
			);
		}

		$compression = $get( 'compression_level' ) ?: 'Medium';
		if ( ! in_array( $compression, array( 'Light', 'Medium', 'Firm' ), true ) ) {
			return $fail( "压缩等级「{$compression}」只能是 Light / Medium / Firm" );
		}

		return array(
			'product_number'    => $get( 'product_number' ),
			'name_zh'           => $get( 'name_zh' ),
			'category'          => strtolower( $get( 'category' ) ),
			'subcategory'       => strtolower( $get( 'subcategory' ) ),
			'sizes'             => $split( $get( 'sizes' ), ',' ),
			'colors'            => $colors,
			'fabric_zh'         => $get( 'fabric_zh' ),
			'care_zh'           => $get( 'care_zh' ) ?: '冷水手洗 平铺晾干',
			'compression_level' => $compression,
			'benefits_zh'       => $split( $get( 'benefits_zh' ), '|' ),
			'featured'          => $yes( $get( 'featured' ) ),
			'best_seller'       => $yes( $get( 'best_seller' ) ),
			'sort_order'        => (int) $get( 'sort_order' ),
			'image_dir'         => basename( str_replace( '\\', '/', $get( 'image_dir' ) ) ),
		);
	}

	// ---------- 图片 ----------

	/** 白底 = 主图，模特 = 悬停图，其余进图集；缺一张就报错。 */
	public static function match_images( array $files, array $colors ) {
		$used = array();
		$pick = function ( $color, $keyword ) use ( $files, &$used ) {
			foreach ( $files as $name ) {
				if ( ! isset( $used[ $name ] ) && 0 === strpos( $name, $color['name_zh'] ) && false !== strpos( $name, $keyword ) ) {
					$used[ $name ] = true;
					return $name;
				}
			}
			throw new RuntimeException( "缺图：找不到「{$color['name_zh']}…{$keyword}…」" );
		};

		$matched = array();
		foreach ( $colors as $color ) {
			$matched[] = $color + array(
				'image'       => $pick( $color, '白底' ),
				'hover_image' => $pick( $color, '模特' ),
			);
		}
		$extras = array_values(
			array_filter(
				$files,
				function ( $name ) use ( $used ) {
					return ! isset( $used[ $name ] );
				}
			)
		);
		return array(
			'colors' => $matched,
			'extras' => $extras,
		);
	}

	/** 返回 显示名 => 真实路径，显示名统一成 UTF-8（Windows 自带压缩的中文文件名是 GBK）。 */
	private static function list_images( $dir ) {
		$files = array();
		foreach ( scandir( $dir ) as $name ) {
			$ext = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
			if ( ! in_array( $ext, self::IMAGE_EXT, true ) || ! is_file( $dir . '/' . $name ) ) {
				continue;
			}
			$files[ self::utf8( $name ) ] = $dir . '/' . $name;
		}
		ksort( $files, SORT_STRING );
		return $files;
	}

	private static function utf8( $name ) {
		return mb_check_encoding( $name, 'UTF-8' ) ? $name : mb_convert_encoding( $name, 'UTF-8', 'GB18030' );
	}

	private static function find_dir( $root, $name ) {
		if ( is_dir( $root . '/' . $name ) ) {
			return $root . '/' . $name;
		}
		$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ), RecursiveIteratorIterator::SELF_FIRST );
		foreach ( $iterator as $entry ) {
			if ( $entry->isDir() && self::utf8( $entry->getFilename() ) === $name ) {
				return $entry->getPathname();
			}
		}
		return '';
	}

	// ---------- 任务文件 ----------

	private static function sanitize_job_id( $id ) {
		return preg_match( '/^[a-z0-9]{16}$/', (string) $id ) ? (string) $id : '';
	}

	private static function job_dir( $job_id ) {
		return rtrim( get_temp_dir(), '/\\' ) . '/yx-import/' . $job_id;
	}

	private static function load_job( $job_id ) {
		$file = self::job_dir( $job_id ) . '/job.json';
		$job  = is_file( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : null;
		return is_array( $job ) && ! empty( $job['rows'] ) ? $job : null;
	}

	private static function save_job( array $job ) {
		file_put_contents( self::job_dir( $job['id'] ) . '/job.json', wp_json_encode( $job, JSON_UNESCAPED_UNICODE ) );
	}

	private static function remove_dir( $dir ) {
		if ( ! is_dir( $dir ) ) {
			return;
		}
		$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ), RecursiveIteratorIterator::CHILD_FIRST );
		foreach ( $iterator as $entry ) {
			$entry->isDir() ? rmdir( $entry->getPathname() ) : unlink( $entry->getPathname() );
		}
		rmdir( $dir );
	}
}
