import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve("wordpress");

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("YANXINNA WordPress plugin delivery", () => {
  it("registers the product model, five locales and minimum manager role", () => {
    const content = read(
      "yanxinna-headless-products/includes/class-content.php"
    );
    const fields = read("yanxinna-headless-products/includes/class-fields.php");

    expect(content).toContain("register_post_type");
    expect(content).toContain("register_taxonomy");
    expect(content).toContain("yx_product_manager");
    expect(content).not.toContain("manage_options");
    expect(fields).toContain("acf_add_local_field_group");
    for (const locale of ["ru-RU", "en-US", "en-GB", "fr-FR", "de-DE"]) {
      expect(fields).toContain(`'${locale}'`);
    }
  });

  it("exposes only published, read-only public routes", () => {
    const rest = read("yanxinna-headless-products/includes/class-rest.php");
    const security = read(
      "yanxinna-headless-products/includes/class-security.php"
    );

    expect(rest.match(/register_rest_route/g)).toHaveLength(3);
    expect(rest.match(/WP_REST_Server::READABLE/g)).toHaveLength(3);
    expect(rest).toContain("'post_status'    => 'publish'");
    expect(security).toContain("YANXINNA_ALLOWED_ORIGINS");
    expect(security).toContain("header_remove( 'Access-Control-Allow-Credentials' )");
    expect(security).toContain("array( 'GET', 'OPTIONS' )");
  });

  it("serves list images at large and detail images at full size", () => {
    const rest = read("yanxinna-headless-products/includes/class-rest.php");

    // 首页一屏 47 张图，列表发原图（单张 1.4MB）会把首屏打满
    expect(rest).toContain("const LIST_IMAGE_SIZE = 'large'");
    expect(rest).toContain("wp_get_attachment_image_src");
    // 详情页图片会被放大看，必须显式要原图
    expect(rest).toContain("self::map_product( $post, 'full' )");
    // 尺寸必须一路传到颜色和图集，否则漏图仍发原图
    expect(rest.match(/\$image_size/g)?.length).toBeGreaterThanOrEqual(8);
  });

  it("blocks username enumeration for logged-out visitors on all three surfaces", () => {
    const security = read(
      "yanxinna-headless-products/includes/class-security.php"
    );

    expect(security).toContain("'rest_endpoints'");
    expect(security).toContain("'/wp/v2/users'");
    expect(security).toContain("block_author_enumeration");
    // 必须早于 redirect_canonical（默认 10），否则 ?author=N 先 301 出用户名
    expect(security).toContain("'template_redirect', array( __CLASS__, 'block_author_enumeration' ), 1");
    // 两个入口都要放行已登录用户，否则后台区块编辑器会断
    expect(security.match(/is_user_logged_in\(\)/g)).toHaveLength(2);
  });

  it("keeps partially translated products visible by falling back per locale", () => {
    const rest = read("yanxinna-headless-products/includes/class-rest.php");
    const fields = read("yanxinna-headless-products/includes/class-fields.php");

    expect(rest).toContain("private static function fill_locale_fallback");
    expect(rest.match(/self::fill_locale_fallback/g)).toHaveLength(2);
    expect(fields).toContain("const DEFAULT_LOCALE = 'ru-RU'");
    expect(fields).toContain("self::DEFAULT_LOCALE === $locale");
  });

  it("configures SMTP from wp-config constants and never hardcodes credentials", () => {
    const mail = read("yanxinna-headless-products/includes/class-mail.php");
    const inquiry = read("yanxinna-headless-products/includes/class-inquiry.php");
    const bootstrap = read("yanxinna-headless-products/yanxinna-headless-products.php");

    // 凭据只能来自 wp-config 常量，和 YANXINNA_REVALIDATE_SECRET 同一套做法
    expect(mail).toContain("YANXINNA_SMTP_USER");
    expect(mail).toContain("YANXINNA_SMTP_PASS");
    expect(mail).not.toMatch(/(Password|Username)\s*=\s*['"][^'"]+['"]/);
    // 常量没配齐必须原样退回 mail()，不能把站点搞挂
    expect(mail).toContain("if ( ! self::is_configured() ) {");
    // 阿里云封 25/587，465 是隐式 TLS
    expect(mail).toContain("const DEFAULT_PORT = 465");
    expect(mail).toContain("465 === $port ? 'ssl' : 'tls'");
    // 139 要求信封发件人 == 认证账号
    expect(mail).toContain("wp_mail_from");

    expect(bootstrap).toContain("YANXINNA_Headless_Mail::register()");
    // 发信失败不能影响询盘落库结果
    expect(inquiry).toContain("private static function notify(");
    expect(inquiry).toContain("error_log(");
  });

  it("keeps refresh secrets in wp-config and sends non-blocking webhooks", () => {
    const webhook = read(
      "yanxinna-headless-products/includes/class-webhook.php"
    );

    expect(webhook).toContain("YANXINNA_REVALIDATE_SECRET");
    expect(webhook).toContain("'x-yanxinna-secret'");
    expect(webhook).toContain("'blocking' => false");
    expect(webhook).not.toMatch(/[a-f0-9]{32,}/i);
  });

  it("migrates four price-free products as drafts with all five locales filled", () => {
    const raw = read("migration/products.json");
    const payload = JSON.parse(raw) as {
      status: string;
      pending_locales: string[];
      products: Array<{
        translations: Record<string, Record<string, unknown>>;
        colors: Array<{ names: Record<string, string> }>;
        parameters: Array<{
          labels: Record<string, string>;
          values: Record<string, string>;
        }>;
      }>;
    };
    const importer = read("migration/import-products.php");
    const locales = ["ru-RU", "en-US", "en-GB", "fr-FR", "de-DE"];

    expect(payload.status).toBe("draft");
    expect(payload.products).toHaveLength(4);
    expect(payload.pending_locales).toEqual([]);

    for (const product of payload.products) {
      for (const locale of locales) {
        const translation = product.translations[locale];
        expect(translation).toBeDefined();
        for (const field of [
          "name",
          "short_description",
          "description",
          "fabric",
          "care",
          "seo_title",
          "seo_description"
        ]) {
          expect(translation[field]).toBeTruthy();
        }
        expect(translation.benefits).not.toHaveLength(0);
      }
      for (const color of product.colors) {
        for (const locale of locales) expect(color.names[locale]).toBeTruthy();
      }
      for (const parameter of product.parameters) {
        for (const locale of locales) {
          expect(parameter.labels[locale]).toBeTruthy();
          expect(parameter.values[locale]).toBeTruthy();
        }
      }
    }
    expect(raw).not.toMatch(/"price"|"compare_at_price"/i);
    expect(importer).toContain("defined( 'WP_CLI' )");
    expect(importer).toContain("'post_status' => 'draft'");
    expect(importer).not.toContain("'post_status' => 'publish'");
  });
});
