/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/uploads/:path*', destination: '/api/media/:path*' },
    ];
  },
  images: { unoptimized: true },
};
export default nextConfig;
