import { beforeEach, describe, expect, it, vi } from "vitest";

const { revalidateTag } = vi.hoisted(() => ({
  revalidateTag: vi.fn()
}));

vi.mock("next/cache", () => ({
  revalidateTag
}));

import { POST } from "@/app/api/revalidate/route";

const secret = "12345678901234567890123456789012";

function request(value?: string) {
  return new Request("https://store.example.com/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(value ? { "x-yanxinna-secret": value } : {})
    },
    body: JSON.stringify({ slug: "seamless-bodysuit" })
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.stubEnv("WORDPRESS_API_URL", "https://cms.example.com/wp-json/yanxinna/v1");
    vi.stubEnv("WORDPRESS_REVALIDATE_SECRET", secret);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://store.example.com");
    revalidateTag.mockReset();
  });

  it("rejects missing and invalid secrets", async () => {
    expect((await POST(request())).status).toBe(401);
    expect((await POST(request("wrong"))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates list, category and product tags", async () => {
    const response = await POST(request(secret));

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("products");
    expect(revalidateTag).toHaveBeenCalledWith("categories");
    expect(revalidateTag).toHaveBeenCalledWith("product:seamless-bodysuit");
  });
});
