/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: "C:/Users/zizo-/OneDrive/Desktop/alipro",
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

module.exports = nextConfig;
