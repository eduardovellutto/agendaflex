import type React from "react"
import dynamic from "next/dynamic"
import { LoadingSpinner } from "@/components/loading-spinner"

// Carregue o componente cliente dinamicamente
const AdminClient = dynamic(() => import("./client"), {
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  ),
})

// Componente de layout do admin
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClient>{children}</AdminClient>
}
