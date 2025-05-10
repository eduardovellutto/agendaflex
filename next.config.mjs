/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    // Desativa a pré-renderização estática para as páginas do dashboard
    // Isso evita que o Next.js tente renderizar páginas que dependem de dados do cliente no servidor
    appDir: true,
  },
  // Configuração para desativar a pré-renderização estática para as páginas do dashboard
  unstable_runtimeJS: true,
}

export default nextConfig
