/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.ielts.org',
      },
      {
        protocol: 'https',
        hostname: 'www.ets.org',
      },
      {
        protocol: 'https',
        hostname: 'educationusa.state.gov',
      },
      {
        protocol: 'https',
        hostname: 'www.chevening.org',
      },
      {
        protocol: 'https',
        hostname: 'www.kaplaninternational.com',
      },
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig