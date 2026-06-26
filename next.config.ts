import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true
  }
};

export default nextConfig;
