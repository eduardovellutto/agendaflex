"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { getUserSubscription, isFeatureAvailable } from "@/lib/services/subscription-service"
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

    try {
      return await isFeatureAvailable(user.uid, featureKey)
    } catch (error) {
      console.error(`Erro ao verificar disponibilidade da feature ${featureKey}:`, error)
      return false
    }
  }

  return {
    subscription,
    isLoading,
    checkFeature,
  }
}
