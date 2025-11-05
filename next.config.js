/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // ⬇️ AÑADE ESTE BLOQUE ⬇️
  typescript: {
    // Esto permite que el build se complete aunque haya errores de tipo.
    // Úsalo con precaución, ya que ignora los problemas de seguridad de tipos.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;