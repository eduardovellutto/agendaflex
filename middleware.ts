import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se o usuário está autenticado para rotas protegidas
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("authToken")

    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Verificar se o usuário está completando o perfil
  if (pathname.startsWith("/dashboard") && !pathname.includes("/profile/setup")) {
    const profileComplete = request.cookies.get("profileComplete")

    if (profileComplete?.value === "false") {
      return NextResponse.redirect(new URL("/dashboard/profile/setup", request.url))
    }
  }

  // Verificar se o usuário está tentando acessar a página de setup do perfil quando já completou
  if (pathname.includes("/profile/setup")) {
    const profileComplete = request.cookies.get("profileComplete")

    if (profileComplete?.value === "true" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/dashboard/profile/setup"],
}
