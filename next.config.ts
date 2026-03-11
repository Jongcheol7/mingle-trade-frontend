import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/spothq/cryptocurrency-icons@master/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/crypto",
        destination: "/crypto/freeboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
