"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Dados de exemplo
const plans = [
  {
    id: "plan_1",
    name: "Free",
    description: "Plano gratuito com recursos básicos",
    price: "R$ 0,00",
    interval: "mensal",
    active: true,
    features: [
      { name: "Até 5 clientes", included: true },
      { name: "Até 3 serviços", included: true },
      { name: "Calendário básico", included: true },
      { name: "Notificações por email", included: false },
      { name: "Relatórios avançados", included: false },
    ],
  },
  {
    id: "plan_2",
    name: "Basic",
    description: "Plano básico para profissionais iniciantes",
    price: "R$ 49,90",
    interval: "mensal",
    active: true,
    features: [
      { name: "Até 50 clientes", included: true },
      { name: "Até 10 serviços", included: true },
      { name: "Calendário completo", included: true },
      { name: "Notificações por email", included: true },
      { name: "Relatórios avançados", included: false },
    ],
  },
  {
    id: "plan_3",
    name: "Pro",
    description: "Plano profissional com todos os recursos",
    price: "R$ 99,90",
    interval: "mensal",
    active: true,
    features: [
      { name: "Clientes ilimitados", included: true },
      { name: "Serviços ilimitados", included: true },
      { name: "Calendário completo", included: true },
      { name: "Notificações por email e SMS", included: true },
      { name: "Relatórios avançados", included: true },
    ],
  },
]

export default function AdminPlansPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activePlans, setActivePlans] = useState(plans)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Não renderizar nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const togglePlanStatus = (planId: string) => {
    setActivePlans(activePlans.map((plan) => (plan.id === planId ? { ...plan, active: !plan.active } : plan)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h2>
        <p className="text-muted-foreground">Visualize e gerencie os planos de assinatura disponíveis.</p>
      </div>

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activePlans.map((plan) => (
          <Card key={plan.id} className={plan.active ? "" : "opacity-70"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant={plan.name === "Pro" ? "default" : "outline"}>
                  {plan.name === "Pro" ? "Popular" : plan.name === "Free" ? "Grátis" : "Básico"}
                </Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <div className="mr-2 h-4 w-4" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground line-through"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`plan-status-${plan.id}`}
                  checked={plan.active}
                  onCheckedChange={() => togglePlanStatus(plan.id)}
                />
                <Label htmlFor={`plan-status-${plan.id}`}>{plan.active ? "Ativo" : "Inativo"}</Label>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Editar plano</DropdownMenuItem>
                  <DropdownMenuItem>Ver assinantes</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    {plan.active ? "Desativar plano" : "Ativar plano"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Planos</CardTitle>
          <CardDescription>Visão geral de todos os planos e suas configurações.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Intervalo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assinantes</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.interval}</TableCell>
                  <TableCell>
                    <Badge variant={plan.active ? "default" : "outline"}>{plan.active ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell>{plan.name === "Free" ? "124" : plan.name === "Basic" ? "56" : "78"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Editar plano</DropdownMenuItem>
                        <DropdownMenuItem>Ver assinantes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          {plan.active ? "Desativar plano" : "Ativar plano"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
