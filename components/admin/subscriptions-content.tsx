"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Calendar, CreditCard, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo
const mockSubscriptions = [
  {
    id: "1",
    user: "João Silva",
    email: "joao@example.com",
    plan: "Pro",
    status: "active",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    price: "R$ 49,90",
  },
  {
    id: "2",
    user: "Maria Oliveira",
    email: "maria@example.com",
    plan: "Basic",
    status: "active",
    startDate: "2023-02-20",
    endDate: "2024-02-20",
    price: "R$ 29,90",
  },
  {
    id: "3",
    user: "Pedro Santos",
    email: "pedro@example.com",
    plan: "Free",
    status: "expired",
    startDate: "2023-03-10",
    endDate: "2023-09-10",
    price: "R$ 0,00",
  },
  {
    id: "4",
    user: "Ana Costa",
    email: "ana@example.com",
    plan: "Pro",
    status: "trial",
    startDate: "2023-04-05",
    endDate: "2023-05-05",
    price: "R$ 49,90",
  },
  {
    id: "5",
    user: "Carlos Ferreira",
    email: "carlos@example.com",
    plan: "Basic",
    status: "pending",
    startDate: "2023-05-12",
    endDate: "2024-05-12",
    price: "R$ 29,90",
  },
]

export function SubscriptionsContent() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Filtrar assinaturas com base no termo de pesquisa
  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRenewSubscription = (subscriptionId: string) => {
    setSubscriptions(
      subscriptions.map((subscription) => {
        if (subscription.id === subscriptionId) {
          // Simular renovação: adicionar 1 ano à data de término
          const endDate = new Date(subscription.endDate)
          endDate.setFullYear(endDate.getFullYear() + 1)

          return {
            ...subscription,
            status: "active",
            endDate: endDate.toISOString().split("T")[0],
          }
        }
        return subscription
      }),
    )

    toast({
      title: "Assinatura renovada",
      description: "A assinatura foi renovada com sucesso por mais um ano.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>
      case "expired":
        return <Badge variant="destructive">Expirada</Badge>
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pendente
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Assinaturas</h2>
        <p className="text-muted-foreground">Gerencie as assinaturas dos usuários da plataforma.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar assinaturas..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>Lista de todas as assinaturas na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.user}</TableCell>
                    <TableCell>{subscription.email}</TableCell>
                    <TableCell>{subscription.plan}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>{subscription.startDate}</TableCell>
                    <TableCell>{subscription.endDate}</TableCell>
                    <TableCell>{subscription.price}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver histórico
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Ver pagamentos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRenewSubscription(subscription.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renovar assinatura
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Cancelar assinatura
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhuma assinatura encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredSubscriptions.length} de {subscriptions.length} assinaturas
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
