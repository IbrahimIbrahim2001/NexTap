import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'l9qngiaw1x.ufs.sh',
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
