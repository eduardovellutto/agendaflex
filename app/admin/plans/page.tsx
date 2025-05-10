"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Edit, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getSubscriptionPlans, updateSubscriptionPlan, createSubscriptionPlan } from "@/lib/services/admin-service"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import { useToast } from "@/components/ui/use-toast"

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    features: "",
    clientsLimit: 0,
    servicesLimit: 0,
    appointmentsLimit: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    async function loadPlans() {
      try {
        const plansData = await getSubscriptionPlans()
        setPlans(plansData)
      } catch (error) {
        console.error("Erro ao carregar planos:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar a lista de planos.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "clientsLimit" || name === "servicesLimit" || name === "appointmentsLimit"
          ? Number.parseFloat(value) || 0
          : value,
    }))
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features.join("\n"),
      clientsLimit: plan.limits.clients,
      servicesLimit: plan.limits.services,
      appointmentsLimit: plan.limits.appointments,
    })
    setIsDialogOpen(true)
  }

  const handleAddNewPlan = () => {
    setEditingPlan(null)
    setFormData({
      name: "",
      description: "",
      price: 0,
      features: "",
      clientsLimit: 0,
      servicesLimit: 0,
      appointmentsLimit: 0,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const planData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        features: formData.features.split("\n").filter((f) => f.trim() !== ""),
        limits: {
          clients: formData.clientsLimit,
          services: formData.servicesLimit,
          appointments: formData.appointmentsLimit,
        },
      }

      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan.id, planData)

        // Atualizar a lista de planos
        setPlans((prevPlans) => prevPlans.map((plan) => (plan.id === editingPlan.id ? { ...plan, ...planData } : plan)))

        toast({
          title: "Plano atualizado",
          description: "O plano foi atualizado com sucesso.",
        })
      } else {
        const newPlanId = await createSubscriptionPlan(planData)

        // Adicionar o novo plano à lista
        setPlans((prevPlans) => [...prevPlans, { id: newPlanId, ...planData } as SubscriptionPlan])

        toast({
          title: "Plano criado",
          description: "O novo plano foi criado com sucesso.",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar plano",
        description: "Não foi possível salvar as alterações do plano.",
      })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h2>
          <p className="text-muted-foreground">Gerencie os planos de assinatura disponíveis na plataforma.</p>
        </div>
        <Button onClick={handleAddNewPlan}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos de Assinatura</CardTitle>
          <CardDescription>Lista de todos os planos disponíveis na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Limite de Clientes</TableHead>
                    <TableHead>Limite de Serviços</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum plano encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.description}</TableCell>
                        <TableCell>{formatCurrency(plan.price)}</TableCell>
                        <TableCell>{plan.limits.clients === 0 ? "Ilimitado" : plan.limits.clients}</TableCell>
                        <TableCell>{plan.limits.services === 0 ? "Ilimitado" : plan.limits.services}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar plano
                              </DropdownMenuItem>
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
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Edite os detalhes do plano de assinatura."
                : "Adicione um novo plano de assinatura à plataforma."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Recursos
                </Label>
                <Input
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Um recurso por linha"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientsLimit" className="text-right">
                  Limite de Clientes
                </Label>
                <Input
                  id="clientsLimit"
                  name="clientsLimit"
                  type="number"
                  min="0"
                  value={formData.clientsLimit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="0 para ilimitado"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="servicesLimit" className="text-right">
                  Limite de Serviços
                </Label>
                <Input
                  id="servicesLimit"
                  name="servicesLimit"
                  type="number"
                  min="0"
                  value={formData.servicesLimit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="0 para ilimitado"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="appointmentsLimit" className="text-right">
                  Limite de Agendamentos
                </Label>
                <Input
                  id="appointmentsLimit"
                  name="appointmentsLimit"
                  type="number"
                  min="0"
                  value={formData.appointmentsLimit}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="0 para ilimitado"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingPlan ? "Salvar alterações" : "Criar plano"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
