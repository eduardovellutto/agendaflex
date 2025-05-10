"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/hooks/use-subscription"
import { cn } from "@/lib/utils"

export function SubscriptionBanner() {
  const { subscription, isLoading } = useSubscription()
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Adicionar animação após o componente ser montado
    const timer = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading || !subscription || dismissed) {
    return null
  }

  // Se a assinatura estiver ativa e não for trial, não mostra o banner
  if (subscription.status === "active" && subscription.planType !== "trial") {
    return null
  }

  const handleUpgrade = () => {
    router.push("/dashboard/subscription/plans")
  }

  const handleDismiss = () => {
    setAnimate(false)
    setTimeout(() => setDismissed(true), 300)
  }

  const daysLeft = subscription.endDate
    ? Math.max(0, Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const getBannerContent = () => {
    if (subscription.status === "trial") {
      return {
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        title: `Período de teste: ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"} restantes`,
        description: "Aproveite todos os recursos durante o período de avaliação.",
        buttonText: "Assinar agora",
        color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
        textColor: "text-blue-800 dark:text-blue-300",
      }
    } else if (subscription.status === "expired") {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        title: "Sua assinatura expirou",
        description: "Renove sua assinatura para continuar utilizando todos os recursos.",
        buttonText: "Renovar assinatura",
        color: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
        textColor: "text-red-800 dark:text-red-300",
      }
    } else if (daysLeft <= 3) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        title: `Sua assinatura expira em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`,
        description: "Renove sua assinatura para evitar a interrupção do serviço.",
        buttonText: "Renovar agora",
        color: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900",
        textColor: "text-amber-800 dark:text-amber-300",
      }
    } else {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        title: `Assinatura ativa: ${subscription.planName}`,
        description: `Válida até ${subscription.endDate?.toLocaleDateString()}`,
        buttonText: "Gerenciar assinatura",
        color: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
        textColor: "text-green-800 dark:text-green-300",
      }
    }
  }

  const content = getBannerContent()

  return (
    <div
      className={cn(
        "relative mb-6 overflow-hidden rounded-lg border px-4 py-3 shadow-sm transition-all duration-300 ease-in-out",
        content.color,
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {content.icon}
          <div>
            <h3 className={cn("font-medium", content.textColor)}>{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleUpgrade} className="whitespace-nowrap">
            {content.buttonText}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleDismiss}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
