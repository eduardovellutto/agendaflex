"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { LoadingSpinner } from "@/components/loading-spinner"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user) {
      // Aqui você verificaria se o usuário é admin
      // Por enquanto, vamos simular com um email específico
      if (user.email !== "admin@example.com") {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  // Não renderiza nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return null
  }

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Não renderiza nada se o usuário não estiver autenticado ou não for admin
  if (!user || user.email !== "admin@example.com") {
    return null
  }

  return <>{children}</>
}
