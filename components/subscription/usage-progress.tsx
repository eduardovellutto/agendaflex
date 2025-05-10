"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/hooks/use-subscription"
import { cn } from "@/lib/utils"

interface UsageProgressProps {
  resourceType: "clients" | "services" | "appointments"
  currentCount: number
  showButton?: boolean
  className?: string
}

export function UsageProgress({ resourceType, currentCount, showButton = true, className }: UsageProgressProps) {
  const { subscription, isLoading } = useSubscription()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Adicionar animação após o componente ser montado
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && subscription) {
      const limit = subscription.limits?.[resourceType] || 0
      // Se o limite for 0, significa ilimitado
      const calculatedProgress = limit === 0 ? 0 : Math.min(100, (currentCount / limit) * 100)
      setProgress(calculatedProgress)
    }
  }, [isLoading, subscription, currentCount, resourceType])

  if (isLoading || !subscription) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
        <div className="flex justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  const limit = subscription.limits?.[resourceType] || 0
  const isUnlimited = limit === 0
  const isNearLimit = progress >= 80
  const isAtLimit = progress >= 100

  const getResourceName = () => {
    switch (resourceType) {
      case "clients":
        return "Clientes"
      case "services":
        return "Serviços"
      case "appointments":
        return "Agendamentos"
      default:
        return resourceType
    }
  }

  const handleUpgrade = () => {
    router.push("/dashboard/subscription/upgrade")
  }

  const getProgressColor = () => {
    if (isUnlimited) return "bg-blue-500"
    if (isAtLimit) return "bg-red-500"
    if (isNearLimit) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{getResourceName()}</h4>
        {isNearLimit && !isUnlimited && (
          <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {isAtLimit ? "Limite atingido" : "Próximo ao limite"}
          </span>
        )}
      </div>

      <Progress
        value={animate ? progress : 0}
        className="h-2 transition-all duration-1000 ease-out"
        indicatorClassName={cn("transition-all duration-1000 ease-out", getProgressColor())}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {currentCount} {isUnlimited ? "" : `/ ${limit}`}
        </p>
        {isUnlimited ? (
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Ilimitado</span>
        ) : (
          <p className="text-xs text-muted-foreground">
            {isAtLimit
              ? "Limite atingido"
              : isNearLimit
                ? `${Math.round(limit - currentCount)} restantes`
                : `${Math.round(((limit - currentCount) / limit) * 100)}% disponível`}
          </p>
        )}
      </div>

      {showButton && (isAtLimit || isNearLimit) && !isUnlimited && (
        <Button variant="outline" size="sm" className="mt-2 w-full text-xs" onClick={handleUpgrade}>
          Fazer upgrade
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
