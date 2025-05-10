export type SubscriptionPlanType = "trial" | "essential" | "professional"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  limits: {
    clients: number
    services: number
    appointments: number
  }
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  planType: SubscriptionPlanType
  status: "active" | "canceled" | "expired" | "trial"
  startDate: Date
  endDate: Date
  trialEndsAt?: Date
  canceledAt?: Date
  paymentMethod?: string
  paymentId?: string
}
