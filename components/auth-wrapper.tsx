"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Não renderiza nada no servidor ou durante o carregamento
  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Não renderiza nada se o usuário não estiver autenticado
  if (!user) {
    return null
  }

  return <>{children}</>
}
