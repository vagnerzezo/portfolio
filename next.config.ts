import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro (menor), WebP como fallback. As fontes originais ficam em public/images.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
