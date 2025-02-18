/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/api/health',
      },
    ]
  },
}

module.exports = nextConfig
