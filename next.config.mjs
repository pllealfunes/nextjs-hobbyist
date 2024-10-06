/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "", // optional, use if needed
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "", // optional, use if needed
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "", // optional, use if needed
      },
    ],
  },
};

export default nextConfig;
