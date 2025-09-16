import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ ไม่หยุด build เวลาเจอ eslint error
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ ไม่หยุด build เวลาเจอ type error
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
