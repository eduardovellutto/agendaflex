"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AppointmentWithClient } from "@/lib/types"
import { updateAppointment } from "@/lib/services/appointment-service"
import { useToast } from "@/components/ui/use-toast"

interface AppointmentListProps {
  appointments: AppointmentWithClient[]
  onUpdate?: () => void
}

export function AppointmentList({ appointments, onUpdate }: AppointmentListProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (appointmentId: string, status: "confirmed" | "canceled" | "completed") => {
    setIsUpdating(appointmentId)
    try {
      await updateAppointment(appointmentId, { status })
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      })
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do agendamento.",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Nenhum agendamento</h3>
        <p className="mt-2 text-sm text-muted-foreground">Não há agendamentos para este período.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const appointmentDate = appointment.date instanceof Date ? appointment.date : appointment.date.toDate()

        return (
          <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{appointment.client.name}</h4>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-2">
                  <span>{format(appointmentDate, "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}</span>
                  {appointment.service && (
                    <>
                      <span className="hidden sm:inline-block">•</span>
                      <span>{appointment.service.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <StatusBadge status={appointment.status} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isUpdating === appointment.id}>
                    {isUpdating === appointment.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                    <span className="sr-only">Ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(appointment.id, "confirmed")}
                    disabled={appointment.status === "confirmed"}
                  >
                    Confirmar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(appointment.id, "completed")}
                    disabled={appointment.status === "completed"}
                  >
                    Marcar como concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(appointment.id, "canceled")}
                    disabled={appointment.status === "canceled"}
                    className="text-destructive"
                  >
                    Cancelar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-gray-100 text-gray-800"
  let text = "Agendado"

  switch (status) {
    case "confirmed":
      bgColor = "bg-blue-100 text-blue-800"
      text = "Confirmado"
      break
    case "completed":
      bgColor = "bg-green-100 text-green-800"
      text = "Concluído"
      break
    case "canceled":
      bgColor = "bg-red-100 text-red-800"
      text = "Cancelado"
      break
  }

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor}`}>{text}</span>
}
