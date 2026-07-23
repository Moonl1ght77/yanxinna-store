import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProductBySlug,
  getProducts,
  getSearchIndex
} from "@/lib/wordpress/repository";
import { validWordPressProduct } from "@/tests/fixtures/wordpress-products";

describe("WordPress repository", () => {
  beforeEach(() => {
    vi.stubEnv("WORDPRESS_API_URL", "https://cms.example.com/wp-json/yanxinna/v1");
    vi.stubEnv("WORDPRESS_REVALIDATE_SECRET", "12345678901234567890123456789012");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://store.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("maps the products endpoint and applies the list cache tag", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([validWordPressProduct])));

    const products = await getProducts();

    expect(products).toHaveLength(1);
    expect(products[0].productNumber).toBe("YX-001");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://cms.example.com/wp-json/yanxinna/v1/products",
      expect.objectContaining({
        method: "GET",
        next: { revalidate: 300, tags: ["products"] }
      })
    );
  });

  it("returns null for a missing product slug", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ code: "not_found" }), { status: 404 })
    );

    await expect(getProductBySlug("missing")).resolves.toBeNull();
  });

  it("throws a sanitized error for an upstream failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("database password leaked in upstream body", { status: 500 })
    );

    await expect(getProducts()).rejects.toThrow("WordPress API request failed");
    await expect(getProducts()).rejects.not.toThrow("database password");
  });

  it("builds a multilingual search index without raw WordPress fields", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([validWordPressProduct]))
    );

    const index = await getSearchIndex();

    expect(index[0]).toEqual({
      id: "101",
      slug: "seamless-bodysuit",
      category: "shapewear",
      names: {
        "ru-RU": "Бесшовное боди",
        "en-US": "Seamless Bodysuit",
        "en-GB": "Seamless Bodysuit",
        "fr-FR": "Body sans coutures",
        "de-DE": "Nahtloser Body"
      }
    });
  });
});
