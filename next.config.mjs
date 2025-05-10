/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Desativa a pré-renderização estática
    unstable_noStore: true,
  },
  // Configuração para desativar a pré-renderização estática para rotas específicas
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'x-no-static-prerender',
            value: '1',
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
