import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API_URL;
const wordpressOrigin = wordpressApiUrl ? new URL(wordpressApiUrl) : null;
const remotePatterns = wordpressOrigin
  ? [
      {
        protocol: wordpressOrigin.protocol === "http:" ? ("http" as const) : ("https" as const),
        hostname: wordpressOrigin.hostname,
        port: wordpressOrigin.port
      }
    ]
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
