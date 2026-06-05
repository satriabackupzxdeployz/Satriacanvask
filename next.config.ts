import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fake-ff", "@napi-rs/canvas"],
};

export default nextConfig;
