"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserSubscription } from "@/lib/services/subscription-service"
import { useAuth } from "@/lib/auth"
import { LoadingSpinner } from "@/components/loading-spinner"

interface SubscriptionGuardProps {
  children: React.ReactNode
  requiredPlan?: "trial" | "essential" | "professional"
  requiredFeature?: string
}

export function SubscriptionGuard({ children, requiredPlan = "trial", requiredFeature }: SubscriptionGuardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setIsLoading(false)
        setHasAccess(false)
        return
      }

      try {
        const subscription = await getUserSubscription(user.uid)

        if (!subscription) {
          setHasAccess(false)
          setIsLoading(false)
          return
        }

        // Verificar se a assinatura expirou
        const now = new Date()
        if (subscription.endDate < now) {
          setHasAccess(false)
          setIsLoading(false)
          return
        }

        // Verificar se o plano do usuário atende ao requisito mínimo
        const planHierarchy = {
          trial: 0,
          essential: 1,
          professional: 2,
        }

        const userPlanLevel = planHierarchy[subscription.planType]
        const requiredPlanLevel = planHierarchy[requiredPlan]

        setHasAccess(userPlanLevel >= requiredPlanLevel)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao verificar assinatura:", error)
        setHasAccess(false)
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [user, requiredPlan, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!hasAccess) {
    // Redirecionar para a página de upgrade
    router.push("/dashboard/subscription/upgrade")
    return null
  }

  return <>{children}</>
}
