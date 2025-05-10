"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Archive, Edit, MoreHorizontal, Phone, Trash, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Client } from "@/lib/types/client"

interface ClientListProps {
  clients: Client[]
  isLoading: boolean
}

export function ClientList({ clients, isLoading }: ClientListProps) {
  const router = useRouter()
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  const handleViewClient = (clientId: string) => {
    router.push(`/dashboard/clients/${clientId}`)
  }

  const handleEditClient = (clientId: string) => {
    router.push(`/dashboard/clients/${clientId}/edit`)
  }

  const toggleExpandClient = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <UserRound className="h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Nenhum cliente encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Comece adicionando um novo cliente para gerenciar seus agendamentos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card
          key={client.id}
          className={cn(
            "overflow-hidden transition-all duration-200",
            expandedClient === client.id ? "shadow-md" : "shadow-sm",
          )}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleExpandClient(client.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {client.isArchived && (
                <Badge variant="outline" className="text-muted-foreground">
                  Arquivado
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleViewClient(client.id)}>
                    <UserRound className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditClient(client.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    {client.isArchived ? "Desarquivar" : "Arquivar"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {expandedClient === client.id && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Telefone</h4>
                  <p className="text-sm mt-1 flex items-center">
                    <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                    {client.phone || "Não informado"}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Último atendimento</h4>
                  <p className="text-sm mt-1">
                    {client.lastAppointment
                      ? new Date(client.lastAppointment).toLocaleDateString()
                      : "Nenhum atendimento"}
                  </p>
                </div>
              </div>

              {client.notes && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Observações</h4>
                  <p className="text-sm mt-1 text-muted-foreground">{client.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClient(client.id)
                  }}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewClient(client.id)
                  }}
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
