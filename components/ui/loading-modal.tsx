"use client"

import { CalendarClock } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface LoadingModalProps {
  isOpen: boolean
  message?: string
}

export function LoadingModal({ isOpen, message = "Carregando..." }: LoadingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <CalendarClock className="h-12 w-12 text-primary animate-pulse" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-center text-lg font-medium">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
