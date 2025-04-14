import Link from "next/link"
import { Edit, MoreHorizontal, User, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { Client } from "@/lib/types/client"

interface ClientListProps {
  clients: Client[]
  isLoading?: boolean
}

export function ClientList({ clients, isLoading = false }: ClientListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <User className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum cliente</h3>
        <p className="mt-2 text-sm text-muted-foreground">Você ainda não possui clientes cadastrados.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/clients/new">Adicionar cliente</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{client.name}</h4>
                <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-2">
                  <span>{client.email}</span>
                  {client.phone && (
                    <>
                      <span className="hidden sm:inline-block">•</span>
                      <span>{client.phone}</span>
                    </>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clients/${client.id}`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/clients/${client.id}/appointments`} className="flex items-center">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      <span>Ver agendamentos</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
