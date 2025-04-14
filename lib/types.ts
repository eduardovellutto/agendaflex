import type { Timestamp } from "firebase/firestore"

export interface User {
  id: string
  name: string
  email: string
  profession: string
  createdAt: Date | Timestamp
  photoURL?: string
  phone?: string
}

export interface Client {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  notes?: string
  createdAt: Date | Timestamp
}

export interface Service {
  id: string
  userId: string
  name: string
  duration: number // in minutes
  price: number
  description?: string
  color?: string
}

export interface Appointment {
  id: string
  userId: string
  clientId: string
  serviceId: string
  date: Date | Timestamp
  status: "scheduled" | "confirmed" | "canceled" | "completed"
  notes?: string
  paymentStatus?: "pending" | "paid" | "refunded"
}

export interface AppointmentWithClient extends Appointment {
  client: Client
  service: Service
}

export interface Availability {
  id: string
  userId: string
  dayOfWeek: number // 0-6, where 0 is Sunday
  startTime: string // format: "HH:MM"
  endTime: string // format: "HH:MM"
  isAvailable: boolean
}

export interface Notification {
  id: string
  userId: string
  appointmentId: string
  type: "email" | "whatsapp"
  status: "pending" | "sent" | "failed"
  scheduledFor: Date | Timestamp
}
