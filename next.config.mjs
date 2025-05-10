/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Desativar a pré-renderização estática para as páginas do dashboard e admin
    // Isso evita erros de hooks sendo chamados fora do contexto do cliente
    unstable_noStore: true,
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
