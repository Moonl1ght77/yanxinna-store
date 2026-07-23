import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API_URL;
const remotePatterns = wordpressApiUrl
  ? [{ protocol: "https" as const, hostname: new URL(wordpressApiUrl).hostname }]
  : [];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    remotePatterns
  }
};

export default nextConfig;
