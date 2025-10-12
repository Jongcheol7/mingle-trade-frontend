import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/spothq/cryptocurrency-icons@master/**",
      },
    ],
  },
};

export default nextConfig;
