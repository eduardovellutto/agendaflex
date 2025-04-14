export interface UserNotifications {
  email: boolean
  sms: boolean
  whatsapp: boolean
  reminderTime: string
}

export interface User {
  id: string
  name: string
  email: string
  profession: string
  bio?: string
  phone?: string
  website?: string
  createdAt: Date
  notifications?: UserNotifications
}
