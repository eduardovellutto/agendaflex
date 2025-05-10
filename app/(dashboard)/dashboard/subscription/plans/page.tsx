"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useAuth } from "@/lib/auth"
import { getSubscriptionPlans, createUserSubscription, getUserSubscription } from "@/lib/services/subscription-service"
import type { SubscriptionPlan, UserSubscription } from "@/lib/types/subscription"

export default function SubscriptionPlansPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      setIsLoading(true)
      try {
        const [plansData, subscriptionData] = await Promise.all([getSubscriptionPlans(), getUserSubscription(user.uid)])

        setPlans(plansData)
        setCurrentSubscription(subscriptionData)
      } catch (error) {
        console.error("Erro ao carregar dados de assinatura:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos de assinatura. Tente novamente mais tarde.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, toast])

  const handleSubscribe = async (planId: string, planType: "trial" | "essential" | "professional") => {
    if (!user) return

    setIsSubscribing(true)
    try {
      await createUserSubscription(user.uid, planType, planId)

      toast({
        title: "Assinatura realizada com sucesso",
        description:
          planType === "trial"
            ? "Seu período de teste de 15 dias foi iniciado."
            : "Sua assinatura foi ativada com sucesso.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao assinar plano:", error)
      toast({
        variant: "destructive",
        title: "Erro ao assinar plano",
        description: "Não foi possível processar sua assinatura. Tente novamente mais tarde.",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Planos de Assinatura" text="Escolha o plano ideal para o seu negócio" />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Plano Trial */}
          <Card className={`border-2 ${!currentSubscription ? "border-primary" : ""}`}>
            <CardHeader>
              <CardTitle>Trial</CardTitle>
              <CardDescription>Experimente gratuitamente por 15 dias</CardDescription>
              <div className="mt-4 text-3xl font-bold">Grátis</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Até 5 clientes</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Até 3 serviços</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Até 10 agendamentos</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Gerenciamento de disponibilidade</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={!currentSubscription ? "default" : "outline"}
                disabled={!!currentSubscription || isSubscribing}
                onClick={() => handleSubscribe("trial", "trial")}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : currentSubscription?.planType === "trial" ? (
                  "Plano atual"
                ) : currentSubscription ? (
                  "Indisponível"
                ) : (
                  "Começar Trial"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Essencial */}
          <Card className={`border-2 ${currentSubscription?.planType === "essential" ? "border-primary" : ""}`}>
            <CardHeader>
              <CardTitle>Essencial</CardTitle>
              <CardDescription>Para profissionais iniciantes</CardDescription>
              <div className="mt-4 text-3xl font-bold">
                {formatCurrency(49.9)}
                <span className="text-sm font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Até 50 clientes</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Até 10 serviços</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Notificações por email</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Relatórios básicos</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={currentSubscription?.planType === "essential" ? "default" : "outline"}
                disabled={isSubscribing}
                onClick={() => handleSubscribe("essential", "essential")}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : currentSubscription?.planType === "essential" ? (
                  "Plano atual"
                ) : (
                  "Assinar plano"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Profissional */}
          <Card className={`border-2 ${currentSubscription?.planType === "professional" ? "border-primary" : ""}`}>
            <CardHeader>
              <CardTitle>Profissional</CardTitle>
              <CardDescription>Para profissionais estabelecidos</CardDescription>
              <div className="mt-4 text-3xl font-bold">
                {formatCurrency(99.9)}
                <span className="text-sm font-normal">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Clientes ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Serviços ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Notificações por email, SMS e WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Pagamentos online</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                  <span>Personalização de marca</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={currentSubscription?.planType === "professional" ? "default" : "outline"}
                disabled={isSubscribing}
                onClick={() => handleSubscribe("professional", "professional")}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : currentSubscription?.planType === "professional" ? (
                  "Plano atual"
                ) : (
                  "Assinar plano"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardShell>
  )
}
