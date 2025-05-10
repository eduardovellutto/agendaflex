"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { getUserSubscription, isFeatureAvailable, checkSubscriptionLimits } from "@/lib/services/subscription-service"
import type { UserSubscription } from "@/lib/types/subscription"

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      try {
        const userSubscription = await getUserSubscription(user.uid)
        setSubscription(userSubscription)
      } catch (error) {
        console.error("Erro ao carregar assinatura:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscription()
  }, [user])

  const checkFeature = async (featureKey: string): Promise<boolean> => {
    if (!user) return false
    return isFeatureAvailable(user.uid, featureKey)
  }

  const checkLimits = async (resourceType: "clients" | "services" | "appointments", currentCount: number) => {
    if (!user) return { withinLimits: false, limit: 0 }
    return checkSubscriptionLimits(user.uid, resourceType, currentCount)
  }

  const isTrialExpired = (): boolean => {
    if (!subscription || subscription.status !== "trial") return false

    const now = new Date()
    return subscription.trialEndsAt ? subscription.trialEndsAt < now : false
  }

  const daysLeftInSubscription = (): number => {
    if (!subscription) return 0

    const now = new Date()
    const endDate = subscription.endDate

    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  return {
    subscription,
    isLoading,
    checkFeature,
    checkLimits,
    isTrialExpired,
    daysLeftInSubscription,
  }
}
