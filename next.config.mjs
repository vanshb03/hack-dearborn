/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/auth/callback',
          destination: '/api/auth/callback',
        },
      ]
    },
  };
  
  export default nextConfig;