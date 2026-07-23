import { describe, expect, it } from "vitest";
import { localizeProduct } from "@/lib/wordpress/localize";
import { mapWordPressProduct } from "@/lib/wordpress/mapper";
import {
  productWithoutMainImage,
  validWordPressProduct
} from "@/tests/fixtures/wordpress-products";

describe("mapWordPressProduct", () => {
  it("maps the public REST contract to the stable frontend record", () => {
    const product = mapWordPressProduct(validWordPressProduct);

    expect(product.productNumber).toBe("YX-001");
    expect(product.category).toBe("shapewear");
    expect(product.translations["ru-RU"].name).toBe("Бесшовное боди");
    expect(product.colors[0].names["fr-FR"]).toBe("Noir");
    expect(product.attachments[0].mimeType).toBe("application/pdf");
  });

  it("rejects records without the required main image", () => {
    expect(() => mapWordPressProduct(productWithoutMainImage)).toThrow();
  });
});

describe("localizeProduct", () => {
  it("selects product, colour, parameter and attachment labels by locale", () => {
    const record = mapWordPressProduct(validWordPressProduct);
    const product = localizeProduct(record, "de-DE");

    expect(product.name).toBe("Nahtloser Body");
    expect(product.colors[0].name).toBe("Schwarz");
    expect(product.parameters[0]).toEqual({
      label: "Material",
      value: "Nylon"
    });
    expect(product.attachments[0].label).toBe("Spezifikation");
  });
});
