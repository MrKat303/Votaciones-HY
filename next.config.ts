import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Optimizaciones para desarrollo
  experimental: {
    // Reduce el uso de memoria
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // Optimizar compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
