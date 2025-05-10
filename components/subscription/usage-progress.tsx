"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { checkSubscriptionLimits } from "@/lib/services/subscription-service"

interface UsageProgressProps {
  resourceType: "clients" | "services" | "appointments"
  currentCount: number
  showAlert?: boolean
}

export function UsageProgress({ resourceType, currentCount, showAlert = true }: UsageProgressProps) {
  const { user } = useAuth()
  const [limit, setLimit] = useState(0)
  const [withinLimits, setWithinLimits] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkLimits() {
      if (!user) return

      try {
        const result = await checkSubscriptionLimits(user.uid, resourceType, currentCount)

        setLimit(result.limit)
        setWithinLimits(result.withinLimits)
      } catch (error) {
        console.error(`Erro ao verificar limites de ${resourceType}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLimits()
  }, [user, resourceType, currentCount])

  if (isLoading) {
    return null
  }

  const percentage = limit > 0 ? (currentCount / limit) * 100 : 0
  const isNearLimit = percentage >= 80 && percentage < 100
  const isAtLimit = percentage >= 100

  const resourceLabels = {
    clients: "clientes",
    services: "serviços",
    appointments: "agendamentos",
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>
          {currentCount} de {limit} {resourceLabels[resourceType]}
        </span>
        <span className={isAtLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : ""}>
          {isAtLimit ? "Limite atingido" : isNearLimit ? "Próximo do limite" : `${Math.round(percentage)}%`}
        </span>
      </div>
      <Progress
        value={percentage > 100 ? 100 : percentage}
        className={`h-2 ${isAtLimit ? "bg-destructive/20" : isNearLimit ? "bg-amber-500/20" : ""}`}
        indicatorClassName={isAtLimit ? "bg-destructive" : isNearLimit ? "bg-amber-500" : ""}
      />

      {showAlert && isAtLimit && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você atingiu o limite de {resourceLabels[resourceType]} do seu plano.
            <a href="/dashboard/subscription/plans" className="ml-1 underline">
              Faça upgrade para adicionar mais.
            </a>
          </AlertDescription>
        </Alert>
      )}

      {showAlert && isNearLimit && (
        <Alert variant="warning" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está próximo do limite de {resourceLabels[resourceType]} do seu plano.
            <a href="/dashboard/subscription/plans" className="ml-1 underline">
              Considere fazer upgrade.
            </a>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
