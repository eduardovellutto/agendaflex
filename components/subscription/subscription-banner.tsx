"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/hooks/use-subscription"

export function SubscriptionBanner() {
  const { subscription, isLoading, isTrialExpired, daysLeftInSubscription } = useSubscription()
  const [dismissed, setDismissed] = useState(false)

  // Verificar se o banner já foi dispensado hoje
  useEffect(() => {
    const dismissedDate = localStorage.getItem("subscription_banner_dismissed")
    if (dismissedDate) {
      const today = new Date().toDateString()
      if (dismissedDate === today) {
        setDismissed(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem("subscription_banner_dismissed", new Date().toDateString())
  }

  if (isLoading || dismissed || !subscription) {
    return null
  }

  // Banner para trial expirado
  if (isTrialExpired()) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Seu período de teste expirou</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span>Escolha um plano para continuar utilizando o AgendaFlex.</span>
          <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
            <Link href="/dashboard/subscription/plans">Ver planos</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Banner para trial ativo
  if (subscription.status === "trial") {
    const daysLeft = daysLeftInSubscription()
    const progressValue = ((15 - daysLeft) / 15) * 100

    return (
      <Alert className="mb-4 border-primary/50 bg-primary/5">
        <Clock className="h-4 w-4 text-primary" />
        <AlertTitle>Período de teste</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>
              Você tem <strong>{daysLeft} dias</strong> restantes no seu período de teste.
            </span>
            <Button size="sm" asChild className="whitespace-nowrap">
              <Link href="/dashboard/subscription/plans">Assinar agora</Link>
            </Button>
          </div>
          <div className="w-full">
            <Progress value={progressValue} className="h-2" />
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Banner para assinatura prestes a expirar (menos de 5 dias)
  const daysLeft = daysLeftInSubscription()
  if (daysLeft <= 5) {
    return (
      <Alert className="mb-4 border-amber-500/50 bg-amber-500/5">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Sua assinatura está prestes a expirar</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span>
            Sua assinatura expira em <strong>{daysLeft} dias</strong>. Renove para continuar utilizando o AgendaFlex.
          </span>
          <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
            <Link href="/dashboard/subscription/renew">Renovar assinatura</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Banner para assinatura ativa (mostrar apenas na primeira visita do dia)
  return (
    <Alert className="mb-4 border-green-500/50 bg-green-500/5">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Assinatura ativa</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>
          Plano <strong>{subscription.planType === "essential" ? "Essencial" : "Profissional"}</strong> ativo até{" "}
          {subscription.endDate.toLocaleDateString()}
        </span>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          Dispensar
        </Button>
      </AlertDescription>
    </Alert>
  )
}
