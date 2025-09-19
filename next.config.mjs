/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'websitedemos.net',
      'localhost',
      '127.0.0.1'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'websitedemos.net',
        port: '',
        pathname: '/wedding-invitation-02/wp-content/uploads/sites/948/**',
      },
    ],
  },
};

export default nextConfig;
