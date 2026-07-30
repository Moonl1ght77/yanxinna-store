import { NextResponse } from "next/server";
import { z } from "zod";
import { getWordPressConfig } from "@/lib/wordpress/config";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  phone: z.string().trim().max(50).optional().default(""),
  subject: z.enum(["oem", "product", "sample", "other"]).optional().default("other"),
  source: z.enum(["contact", "product"]).optional().default("contact"),
  locale: z.string().trim().max(10).optional().default(""),
  productName: z.string().trim().max(200).optional().default(""),
  productNumber: z.string().trim().max(200).optional().default(""),
  productColor: z.string().trim().max(200).optional().default(""),
  productSize: z.string().trim().max(200).optional().default(""),
  // 蜜罐：表单里对用户隐藏，被填上就是脚本。
  website: z.string().max(200).optional().default("")
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { WORDPRESS_API_URL, WORDPRESS_REVALIDATE_SECRET } = getWordPressConfig();
  const data = parsed.data;

  let response: Response;
  try {
    response = await fetch(`${WORDPRESS_API_URL.replace(/\/$/, "")}/inquiries`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        "x-yanxinna-secret": WORDPRESS_REVALIDATE_SECRET,
        // 交给 WordPress 侧做按访客 IP 的限流，否则所有请求都来自 Worker 同一出口。
        "x-forwarded-for":
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for") ??
          ""
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone,
        subject: data.subject,
        source: data.source,
        locale: data.locale,
        website: data.website,
        product_name: data.productName,
        product_number: data.productNumber,
        product_color: data.productColor,
        product_size: data.productSize
      })
    });
  } catch {
    return NextResponse.json({ ok: false, error: "unreachable" }, { status: 502 });
  }

  if (response.status === 429) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: "rejected" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
