import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // pathname: '/dziazpcgd/image/upload/**', // Adjust the pathname if your Cloudinary path structure is different, but this is typical for uploads
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '**', // Allows all paths from img.freepik.com
      },
    ],
  },
};

export default nextConfig;
