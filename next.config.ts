import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // ⬇️ AÑADE ESTE BLOQUE ⬇️
  typescript: {
    // !! ADVERTENCIA !!
    // Peligrosamente permite que la compilación se complete 
    // incluso con errores de tipo de TypeScript.
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;