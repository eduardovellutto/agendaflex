"use client"

import { AuthProvider } from "@/lib/auth"
import { LoadingSpinner } from "./loading-spinner"
import { useState, useEffect } from "react"
import type { ReactNode } from "react"

export function AuthProviderClient({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Não renderizar nada no servidor para evitar erros de hidratação
  if (!isClient) {
    return <LoadingSpinner />
  }

  return <AuthProvider>{children}</AuthProvider>
}
