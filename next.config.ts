import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "jrmn.s3.ap-south-1.amazonaws.com",
      "images.unsplash.com",
      "fykptqynmlmaggjvyyjj.supabase.co",
      "placehold.co",
    ],
  },
};

export default nextConfig;
