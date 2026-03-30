/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ✅ disables lint during builds
    },
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@fraymo/api-wrapper'],
  images: {
    unoptimized: true,
    domains: [
      "lh3.googleusercontent.com",
      "images.pexels.com",
      "halaloimages.s3.ap-south-1.amazonaws.com",
      "fraymodev.s3.ap-south-1.amazonaws.com",
        "fraymoprod.s3.ap-south-1.amazonaws.com",
      'via.placeholder.com',
      'picsum.photos',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "https://www.pexels.com/",
      },
    ],
  },
};

export default nextConfig;
