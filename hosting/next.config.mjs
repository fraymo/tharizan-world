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
        hostname: "www.pexels.com",
      },
    ],
  },
  async rewrites() {
    return [
      {source: "/:storeSlug/cart", destination: "/cart?storeSlug=:storeSlug"},
      {source: "/:storeSlug/wishlist", destination: "/wishlist?storeSlug=:storeSlug"},
      {source: "/:storeSlug/accounts", destination: "/accounts?storeSlug=:storeSlug"},
      {source: "/:storeSlug/orders", destination: "/orders?storeSlug=:storeSlug"},
      {source: "/:storeSlug/loginpage", destination: "/loginpage?storeSlug=:storeSlug"},
      {source: "/:storeSlug/search", destination: "/search?storeSlug=:storeSlug"},
      {source: "/:storeSlug/add-address", destination: "/add-address?storeSlug=:storeSlug"},
      {source: "/:storeSlug/addresses", destination: "/addresses?storeSlug=:storeSlug"},
      {source: "/:storeSlug/notifications", destination: "/notifications?storeSlug=:storeSlug"},
      {source: "/:storeSlug/wallet", destination: "/wallet?storeSlug=:storeSlug"},
      {source: "/:storeSlug/:category/:subCategory/:product", destination: "/:category/:subCategory/:product?storeSlug=:storeSlug"},
      {source: "/:storeSlug/:category/:subCategory", destination: "/:category/:subCategory?storeSlug=:storeSlug"},
      {source: "/:storeSlug/:category", destination: "/:category?storeSlug=:storeSlug"},
    ];
  }
};

export default nextConfig;
