"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Search, MoreHorizontal, Filter } from "lucide-react"

// Dados de exemplo
const subscriptions = [
  {
    id: "sub_1",
    user: "João Silva",
    email: "joao.silva@example.com",
    plan: "Pro",
    status: "active",
    startDate: "10/01/2023",
    endDate: "10/01/2024",
    amount: "R$ 99,90",
  },
  {
    id: "sub_2",
    user: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    plan: "Basic",
    status: "trial",
    startDate: "15/02/2023",
    endDate: "15/03/2023",
    amount: "R$ 0,00",
  },
  {
    id: "sub_3",
    user: "Pedro Santos",
    email: "pedro.santos@example.com",
    plan: "Free",
    status: "canceled",
    startDate: "20/03/2023",
    endDate: "20/04/2023",
    amount: "R$ 0,00",
  },
  {
    id: "sub_4",
    user: "Ana Costa",
    email: "ana.costa@example.com",
    plan: "Pro",
    status: "active",
    startDate: "05/04/2023",
    endDate: "05/04/2024",
    amount: "R$ 99,90",
  },
  {
    id: "sub_5",
    user: "Carlos Ferreira",
    email: "carlos.ferreira@example.com",
    plan: "Basic",
    status: "past_due",
    startDate: "12/05/2023",
    endDate: "12/06/2023",
    amount: "R$ 49,90",
  },
]

export default function AdminSubscriptionsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSubscriptions, setFilteredSubscriptions] = useState(subscriptions)

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filterSubscriptions = useCallback(() => {
    const filtered = subscriptions.filter(
      (subscription) =>
        subscription.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSubscriptions(filtered)
  }, [searchTerm])

  // Filtrar assinaturas com base no termo de pesquisa
  useEffect(() => {
    filterSubscriptions()
  }, [searchTerm, filterSubscriptions])

  // Não renderizar nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>
      case "canceled":
        return <Badge variant="outline">Cancelada</Badge>
      case "past_due":
        return <Badge variant="destructive">Pagamento Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Assinaturas</h2>
        <p className="text-muted-foreground">Visualize e gerencie as assinaturas da plataforma.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar assinaturas..."
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>Lista de todas as assinaturas da plataforma.</CardDescription>
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
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.user}</TableCell>
                  <TableCell>{subscription.email}</TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>{renderStatusBadge(subscription.status)}</TableCell>
                  <TableCell>{subscription.startDate}</TableCell>
                  <TableCell>{subscription.endDate}</TableCell>
                  <TableCell>{subscription.amount}</TableCell>
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
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Alterar plano</DropdownMenuItem>
                        <DropdownMenuItem>Renovar assinatura</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Cancelar assinatura</DropdownMenuItem>
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
