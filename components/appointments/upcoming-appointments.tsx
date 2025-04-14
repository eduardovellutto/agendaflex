import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarClock, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Appointment } from "@/lib/types/appointment"

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
  isLoading?: boolean
}

export function UpcomingAppointments({ appointments, isLoading = false }: UpcomingAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CalendarClock className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum agendamento</h3>
        <p className="mt-2 text-sm text-muted-foreground">Você não possui agendamentos para hoje.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center rounded-lg border p-3">
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{appointment.clientName}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {format(new Date(appointment.date), "HH:mm", { locale: ptBR })}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{appointment.serviceName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
