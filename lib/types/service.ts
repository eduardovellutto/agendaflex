export interface Service {
  id: string
  professionalId: string
  name: string
  description?: string
  duration: number
  price: number
  color?: string
  createdAt: Date
}
