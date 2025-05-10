"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useAuth } from "@/lib/auth"
import { getUserSubscription } from "@/lib/services/subscription-service"
import type { UserSubscription } from "@/lib/types/subscription"

export default function UpgradePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSubscription() {
      if (!user) return

      setIsLoading(true)
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

  const getSubscriptionStatus = () => {
    if (!subscription) {
      return {
        title: "Você não possui uma assinatura ativa",
        description: "Para acessar todos os recursos do AgendaFlex, escolha um plano de assinatura.",
        action: "Escolher plano",
      }
    }

    if (subscription.status === "trial") {
      const now = new Date()
      if (subscription.trialEndsAt && subscription.trialEndsAt < now) {
        return {
          title: "Seu período de teste expirou",
          description: "Para continuar utilizando o AgendaFlex, escolha um plano de assinatura.",
          action: "Escolher plano",
        }
      }

      return {
        title: "Você está utilizando o plano Trial",
        description: "Para acessar recursos avançados, faça upgrade para um plano pago.",
        action: "Fazer upgrade",
      }
    }

    if (subscription.status === "canceled" || subscription.status === "expired") {
      return {
        title: "Sua assinatura foi cancelada ou expirou",
        description: "Para continuar utilizando o AgendaFlex, renove sua assinatura.",
        action: "Renovar assinatura",
      }
    }

    return {
      title: "Você precisa de um plano superior",
      description: "O recurso que você tentou acessar não está disponível no seu plano atual.",
      action: "Ver planos disponíveis",
    }
  }

  const status = getSubscriptionStatus()

  return (
    <DashboardShell>
      <DashboardHeader heading="Upgrade Necessário" text="Atualize seu plano para acessar mais recursos" />

      <div className="max-w-md mx-auto">
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acesso limitado</AlertTitle>
          <AlertDescription>
            Você tentou acessar um recurso que não está disponível no seu plano atual.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>{status.title}</CardTitle>
            <CardDescription>{status.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Escolha um plano que atenda às suas necessidades e tenha acesso a todos os recursos do AgendaFlex.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/dashboard/subscription/plans")}>
              {status.action}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
