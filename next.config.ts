import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/apps",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/physique",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/pc",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/prof",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/prof-physique",
        destination: "/eddams",
        permanent: false,
      },
      {
        source: "/hassan-eddams",
        destination: "/eddams",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
