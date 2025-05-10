import type { User } from "./user"
import type { UserSubscription } from "./subscription"

export interface AdminUser extends User {
  role: "admin" | "user"
  lastLogin?: Date
  createdAt: Date
}

export interface AdminStats {
  totalUsers: number
  activeSubscriptions: number
  trialSubscriptions: number
  expiredSubscriptions: number
  revenueThisMonth: number
  revenueLastMonth: number
  userGrowth: number // Percentual de crescimento
}

export interface SubscriptionWithUser extends UserSubscription {
  user: {
    id: string
    email: string
    displayName?: string
  }
}

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: Date
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  details?: string
  timestamp: Date
}
