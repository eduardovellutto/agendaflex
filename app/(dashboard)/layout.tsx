"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthProviderClient } from "@/components/auth-provider-client"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Não renderiza nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <AuthProviderClient>{children}</AuthProviderClient>
}
