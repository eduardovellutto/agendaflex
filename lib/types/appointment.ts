export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "canceled"

export interface Appointment {
  id: string
  professionalId: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  date: Date | string
  duration: number
  status: AppointmentStatus
  notes?: string
  paymentStatus?: "pending" | "paid" | "refunded"
  createdAt: Date
}
