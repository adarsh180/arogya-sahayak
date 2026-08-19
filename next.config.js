/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['pdf-parse'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(self), microphone=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://api.groq.com https://openrouter.ai http://127.0.0.1:*; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pdf-parse')
    }
    return config
  }
}

module.exports = nextConfig
