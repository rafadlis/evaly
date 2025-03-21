import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dlzoxca5dn0fu.cloudfront.net",
      },
    ],
  },
};

 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
