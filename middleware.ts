import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rotas que requerem autenticação
  const authRoutes = ["/dashboard"]

  // Verifica se a URL atual começa com alguma das rotas autenticadas
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Se for uma rota autenticada e estiver em modo de pré-renderização,
  // retorna um status 200 vazio para evitar erros
  if (isAuthRoute && request.headers.get("x-nextjs-data") === "1") {
    return NextResponse.json({})
  }

  // Verificar se o usuário está na página de setup de perfil
  const isProfileSetupRoute = request.nextUrl.pathname === "/dashboard/profile/setup"

  // Se o usuário estiver na página de setup, permitir o acesso
  if (isProfileSetupRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Rotas que o middleware deve ser executado
    "/dashboard/:path*",
  ],
}
