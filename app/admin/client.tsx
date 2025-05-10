"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import { AdminShell } from "@/components/admin/admin-shell"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminClient({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Não renderizar nada durante o SSR
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  )
}
