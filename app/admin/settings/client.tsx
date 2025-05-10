"use client"

import dynamic from "next/dynamic"
import { LoadingSpinner } from "@/components/loading-spinner"

// Carregue o componente cliente dinamicamente com SSR desativado
const SettingsContent = dynamic(
  () => import("@/components/admin/settings-content").then((mod) => mod.SettingsContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ),
  },
)

export default function SettingsClient() {
  return <SettingsContent />
}
