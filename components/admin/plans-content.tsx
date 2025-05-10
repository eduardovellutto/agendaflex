"use client"

import { useState } from "react"
import { Plus, Edit, Trash, Check, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo
const mockPlans = [
  {
    id: "1",
    name: "Free",
    description: "Plano gratuito com recursos básicos",
    price: "R$ 0,00",
    interval: "month",
    features: ["5 clientes", "3 serviços", "Calendário básico"],
    isActive: true,
  },
  {
    id: "2",
    name: "Basic",
    description: "Plano básico para profissionais iniciantes",
    price: "R$ 29,90",
    interval: "month",
    features: ["20 clientes", "10 serviços", "Calendário completo", "Notificações por email"],
    isActive: true,
  },
  {
    id: "3",
    name: "Pro",
    description: "Plano profissional com recursos avançados",
    price: "R$ 49,90",
    interval: "month",
    features: [
      "Clientes ilimitados",
      "Serviços ilimitados",
      "Calendário completo",
      "Notificações por email e SMS",
      "Relatórios avançados",
    ],
    isActive: true,
  },
  {
    id: "4",
    name: "Enterprise",
    description: "Plano empresarial para equipes",
    price: "R$ 99,90",
    interval: "month",
    features: [
      "Clientes ilimitados",
      "Serviços ilimitados",
      "Calendário completo",
      "Notificações por email e SMS",
      "Relatórios avançados",
      "Suporte prioritário",
      "API de integração",
    ],
    isActive: false,
  },
]

export function PlansContent() {
  const [plans, setPlans] = useState(mockPlans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const { toast } = useToast()

  const handleToggleActive = (planId: string) => {
    setPlans(
      plans.map((plan) => {
        if (plan.id === planId) {
          return { ...plan, isActive: !plan.isActive }
        }
        return plan
      }),
    )

    const plan = plans.find((p) => p.id === planId)
    toast({
      title: plan?.isActive ? "Plano desativado" : "Plano ativado",
      description: `O plano ${plan?.name} foi ${plan?.isActive ? "desativado" : "ativado"} com sucesso.`,
    })
  }

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan)
    setIsDialogOpen(true)
  }

  const handleSavePlan = () => {
    if (editingPlan) {
      if (editingPlan.id) {
        // Atualizar plano existente
        setPlans(plans.map((plan) => (plan.id === editingPlan.id ? editingPlan : plan)))
        toast({
          title: "Plano atualizado",
          description: `O plano ${editingPlan.name} foi atualizado com sucesso.`,
        })
      } else {
        // Adicionar novo plano
        const newPlan = {
          ...editingPlan,
          id: (plans.length + 1).toString(),
          isActive: true,
          features: editingPlan.features ? editingPlan.features.split("\n") : [],
        }
        setPlans([...plans, newPlan])
        toast({
          title: "Plano criado",
          description: `O plano ${editingPlan.name} foi criado com sucesso.`,
        })
      }
    }
    setIsDialogOpen(false)
    setEditingPlan(null)
  }

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    setPlans(plans.filter((plan) => plan.id !== planId))
    toast({
      title: "Plano excluído",
      description: `O plano ${plan?.name} foi excluído com sucesso.`,
    })
  }

  const handleNewPlan = () => {
    setEditingPlan({
      name: "",
      description: "",
      price: "",
      interval: "month",
      features: "",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h2>
          <p className="text-muted-foreground">Gerencie os planos de assinatura disponíveis na plataforma.</p>
        </div>
        <Button onClick={handleNewPlan}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos</CardTitle>
          <CardDescription>Lista de todos os planos disponíveis na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell>
                    {plan.price}/{plan.interval === "month" ? "mês" : "ano"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {feature}
                        </Badge>
                      ))}
                      {plan.features.length > 2 && (
                        <Badge variant="outline">+{plan.features.length - 2} recursos</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.isActive ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar plano
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(plan.id)}>
                          {plan.isActive ? (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Desativar plano
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Ativar plano
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir plano
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>
              {editingPlan?.id
                ? "Faça as alterações necessárias no plano selecionado."
                : "Preencha os detalhes para criar um novo plano."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editingPlan?.name || ""}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                value={editingPlan?.description || ""}
                onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input
                id="price"
                value={editingPlan?.price || ""}
                onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interval" className="text-right">
                Intervalo
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Label htmlFor="interval-month">Mensal</Label>
                <input
                  type="radio"
                  id="interval-month"
                  name="interval"
                  value="month"
                  checked={editingPlan?.interval === "month"}
                  onChange={() => setEditingPlan({ ...editingPlan, interval: "month" })}
                />
                <Label htmlFor="interval-year">Anual</Label>
                <input
                  type="radio"
                  id="interval-year"
                  name="interval"
                  value="year"
                  checked={editingPlan?.interval === "year"}
                  onChange={() => setEditingPlan({ ...editingPlan, interval: "year" })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="features" className="text-right">
                Recursos
              </Label>
              <Textarea
                id="features"
                value={
                  editingPlan?.features
                    ? Array.isArray(editingPlan.features)
                      ? editingPlan.features.join("\n")
                      : editingPlan.features
                    : ""
                }
                onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value })}
                placeholder="Um recurso por linha"
                className="col-span-3"
                rows={5}
              />
            </div>
            {editingPlan?.id && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Ativo
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="isActive"
                    checked={editingPlan?.isActive || false}
                    onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, isActive: checked })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
