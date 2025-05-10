"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { isAdmin } from "@/lib/services/admin-service"
import { LoadingSpinner } from "@/components/loading-spinner"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const adminStatus = await isAdmin(user.uid)
        setIsAuthorized(adminStatus)
      } catch (error) {
        console.error("Erro ao verificar status de administrador:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthorized) {
    router.push("/dashboard")
    return null
  }

  return <>{children}</>
}
