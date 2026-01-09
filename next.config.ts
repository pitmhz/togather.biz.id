import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Image Optimization Configuration
   * Allows optimized loading from Supabase Storage
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hhbcqgxixntpdwlzpclr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Placeholder image services for development
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Image size optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable blur placeholder for better UX
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Experimental Features
   */
  experimental: {
    // Enable server actions (already enabled by default in Next.js 15+)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  /**
   * Headers for security and performance
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
