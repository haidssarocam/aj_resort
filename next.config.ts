import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      '192.168.1.101',      // Current local IP
      '192.168.70.191',     // Example from your code
      'localhost',          // For local development
      // Add any other domains you might use
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',      // Fallback for any IP in development
      },
    ],
  },
};

export default nextConfig;
