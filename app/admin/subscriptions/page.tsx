"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getAllSubscriptions, updateUserSubscription } from "@/lib/services/admin-service"
import type { SubscriptionWithUser } from "@/lib/types/admin"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const subscriptionsData = await getAllSubscriptions(currentPage, 10)
        setSubscriptions(subscriptionsData)
        setFilteredSubscriptions(subscriptionsData)
      } catch (error) {
        console.error("Erro ao carregar assinaturas:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar assinaturas",
          description: "Não foi possível carregar a lista de assinaturas.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSubscriptions()
  }, [currentPage, toast])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubscriptions(subscriptions)
    } else {
      const filtered = subscriptions.filter(
        (subscription) =>
          subscription.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.planType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSubscriptions(filtered)
    }
  }, [searchTerm, subscriptions])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewSubscription = (subscriptionId: string) => {
    router.push(`/admin/subscriptions/${subscriptionId}`)
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await updateUserSubscription(subscriptionId, {
        status: "canceled",
        canceledAt: new Date(),
      })

      toast({
        title: "Assinatura cancelada",
        description: "A assinatura foi cancelada com sucesso.",
      })

      // Atualizar a lista de assinaturas
      const updatedSubscriptions = subscriptions.map((subscription) => {
        if (subscription.id === subscriptionId) {
          return {
            ...subscription,
            status: "canceled",
            canceledAt: new Date(),
          }
        }
        return subscription
      })

      setSubscriptions(updatedSubscriptions)
      setFilteredSubscriptions(
        filteredSubscriptions.map((subscription) => {
          if (subscription.id === subscriptionId) {
            return {
              ...subscription,
              status: "canceled",
              canceledAt: new Date(),
            }
          }
          return subscription
        }),
      )
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error)
      toast({
        variant: "destructive",
        title: "Erro ao cancelar assinatura",
        description: "Não foi possível cancelar a assinatura.",
      })
    }
  }

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      const now = new Date()
      const newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      await updateUserSubscription(subscriptionId, {
        status: "active",
        startDate: now,
        endDate: newEndDate,
        canceledAt: null,
      })

      toast({
        title: "Assinatura renovada",
        description: "A assinatura foi renovada com sucesso.",
      })

      // Atualizar a lista de assinaturas
      const updatedSubscriptions = subscriptions.map((subscription) => {
        if (subscription.id === subscriptionId) {
          return {
            ...subscription,
            status: "active",
            startDate: now,
            endDate: newEndDate,
            canceledAt: undefined,
          }
        }
        return subscription
      })

      setSubscriptions(updatedSubscriptions)
      setFilteredSubscriptions(
        filteredSubscriptions.map((subscription) => {
          if (subscription.id === subscriptionId) {
            return {
              ...subscription,
              status: "active",
              startDate: now,
              endDate: newEndDate,
              canceledAt: undefined,
            }
          }
          return subscription
        }),
      )
    } catch (error) {
      console.error("Erro ao renovar assinatura:", error)
      toast({
        variant: "destructive",
        title: "Erro ao renovar assinatura",
        description: "Não foi possível renovar a assinatura.",
      })
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativa</Badge>
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>
      case "canceled":
        return <Badge variant="destructive">Cancelada</Badge>
      case "expired":
        return <Badge variant="outline">Expirada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "trial":
        return <Badge variant="outline">Trial</Badge>
      case "essential":
        return <Badge className="bg-blue-500">Essencial</Badge>
      case "professional":
        return <Badge className="bg-purple-500">Profissional</Badge>
      default:
        return <Badge variant="outline">{planType}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Assinaturas</h2>
          <p className="text-muted-foreground">Gerencie as assinaturas dos usuários da plataforma.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
          <CardDescription>Lista de todas as assinaturas na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por usuário ou plano..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma assinatura encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">
                          {subscription.user.displayName || subscription.user.email}
                        </TableCell>
                        <TableCell>{getPlanBadge(subscription.planType)}</TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>{formatDate(subscription.startDate)}</TableCell>
                        <TableCell>{formatDate(subscription.endDate)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewSubscription(subscription.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {subscription.status === "active" || subscription.status === "trial" ? (
                                <DropdownMenuItem onClick={() => handleCancelSubscription(subscription.id)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancelar assinatura
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleRenewSubscription(subscription.id)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Renovar assinatura
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={filteredSubscriptions.length < 10}
          >
            Próxima
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
