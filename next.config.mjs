/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "", // optional, use if needed
      },
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  serverExternalPackages: ["yjs"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
