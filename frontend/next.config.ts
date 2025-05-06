import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dziazpcgd/image/upload/**', // Adjust the pathname if your Cloudinary path structure is different, but this is typical for uploads
      },
    ],
  },
};

export default nextConfig;
