/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // If you have image issues, also add:
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig