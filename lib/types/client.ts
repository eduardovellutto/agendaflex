export interface Client {
  id: string
  professionalId: string
  name: string
  email: string
  phone?: string
  notes?: string
  createdAt: Date
}
