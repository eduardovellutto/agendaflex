"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/loading-spinner"

interface LoadingModalProps {
  isOpen: boolean
  message?: string
}

export function LoadingModal({ isOpen, message = "Carregando..." }: LoadingModalProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Pequeno atraso para evitar flashes em carregamentos rápidos
    let timer: NodeJS.Timeout

    if (isOpen) {
      timer = setTimeout(() => setOpen(true), 300)
    } else {
      setOpen(false)
    }

    return () => clearTimeout(timer)
  }, [isOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent
        className="sm:max-w-md flex flex-col items-center justify-center p-10 gap-4 border-none shadow-lg"
        hideClose
      >
        <LoadingSpinner size="lg" />
        <p className="text-center text-muted-foreground animate-pulse">{message}</p>
      </DialogContent>
    </Dialog>
  )
}
