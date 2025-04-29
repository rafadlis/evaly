import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/services/common/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "d3hopitjstq08.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "assets.evaly.io",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);