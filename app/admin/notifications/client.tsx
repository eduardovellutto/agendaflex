"use client"

import { useState, useEffect } from "react"
import { NotificationsContent } from "@/components/admin/notifications-content"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function NotificationsClient() {
  const [isMounted, setIsMounted] = useState(false)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Não renderizar nada durante o SSR
  if (!isMounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <NotificationsContent />
}
