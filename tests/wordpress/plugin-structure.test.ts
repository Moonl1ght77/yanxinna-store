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

  it("keeps refresh secrets in wp-config and sends non-blocking webhooks", () => {
    const webhook = read(
      "yanxinna-headless-products/includes/class-webhook.php"
    );

    expect(webhook).toContain("YANXINNA_REVALIDATE_SECRET");
    expect(webhook).toContain("'x-yanxinna-secret'");
    expect(webhook).toContain("'blocking' => false");
    expect(webhook).not.toMatch(/[a-f0-9]{32,}/i);
  });

  it("migrates four price-free products as drafts with pending translations", () => {
    const raw = read("migration/products.json");
    const payload = JSON.parse(raw) as {
      status: string;
      pending_locales: string[];
      products: Array<Record<string, unknown>>;
    };
    const importer = read("migration/import-products.php");

    expect(payload.status).toBe("draft");
    expect(payload.products).toHaveLength(4);
    expect(payload.pending_locales).toEqual(["ru-RU", "fr-FR", "de-DE"]);
    expect(raw).not.toMatch(/"price"|"compare_at_price"/i);
    expect(importer).toContain("defined( 'WP_CLI' )");
    expect(importer).toContain("'post_status' => 'draft'");
    expect(importer).not.toContain("'post_status' => 'publish'");
  });
});
