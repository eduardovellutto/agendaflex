"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useAuth } from "@/lib/auth"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Não renderiza nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Não renderiza nada se o usuário não estiver autenticado
  if (!user) {
    return null
  }

  // Verifica se estamos na página de configuração inicial do perfil
  const isProfileSetup = pathname === "/dashboard/profile/setup"

  // Se for a página de configuração inicial, não envolve com DashboardShell
  if (isProfileSetup) {
    return children
  }

  // Para todas as outras páginas do dashboard, envolve com DashboardShell
  return <DashboardShell>{children}</DashboardShell>
}
