"use client"

import dynamic from "next/dynamic"
import { LoadingSpinner } from "@/components/loading-spinner"

// Carregue o componente cliente dinamicamente com SSR desativado
const NotificationsContent = dynamic(
  () => import("@/components/admin/notifications-content").then((mod) => mod.NotificationsContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ),
  },
)

export default function NotificationsClient() {
  return <NotificationsContent />
}
