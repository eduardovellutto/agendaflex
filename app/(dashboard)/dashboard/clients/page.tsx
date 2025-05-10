"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ClientList } from "@/components/clients/client-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth"
import { getClientsByProfessional } from "@/lib/services/client-service"
import type { Client } from "@/lib/types/client"
import { useSubscription } from "@/hooks/use-subscription"
import { useRouter } from "next/navigation"
import { UsageProgress } from "@/components/subscription/usage-progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { checkLimits } = useSubscription()
  const [isAtLimit, setIsAtLimit] = useState(false)
  const [clientLimit, setClientLimit] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function loadClients() {
      if (user?.uid) {
        setIsLoading(true)
        try {
          const clientsData = await getClientsByProfessional(user.uid)
          setClients(clientsData)
          setFilteredClients(clientsData)

          // Verificar limites
          const { withinLimits, limit } = await checkLimits("clients", clientsData.length)
          setIsAtLimit(!withinLimits)
          setClientLimit(limit)
        } catch (error) {
          console.error("Error loading clients:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadClients()
  }, [user, checkLimits])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone?.toLowerCase().includes(query),
      )
      setFilteredClients(filtered)
    }
  }, [searchQuery, clients])

  // Agrupar clientes por status
  const activeClients = filteredClients.filter((client) => !client.isArchived)
  const archivedClients = filteredClients.filter((client) => client.isArchived)

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Clientes" text="Gerencie seus clientes e veja o histórico de atendimentos.">
        {isAtLimit ? (
          <Button variant="outline" onClick={() => router.push("/dashboard/subscription/upgrade")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Limite atingido
          </Button>
        ) : (
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        )}
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Meus Clientes</CardTitle>
              <CardDescription>Você tem um total de {clients.length} clientes cadastrados.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar clientes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="active" className="mt-6">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="active" className="flex-1 md:flex-none">
                  Ativos ({activeClients.length})
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1 md:flex-none">
                  Arquivados ({archivedClients.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <ClientList clients={activeClients} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="archived">
                <ClientList clients={archivedClients} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Clientes</CardTitle>
            <CardDescription>Acompanhe o limite de clientes do seu plano atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <UsageProgress resourceType="clients" currentCount={clients.length} />

            {isAtLimit && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/30 dark:border-amber-900">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                  Limite de clientes atingido
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-4">
                  Você atingiu o limite de {clientLimit} clientes do seu plano atual. Faça um upgrade para adicionar
                  mais clientes.
                </p>
                <Button size="sm" className="w-full" onClick={() => router.push("/dashboard/subscription/upgrade")}>
                  Fazer upgrade
                </Button>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-medium mb-2">Dicas para gerenciar clientes</h4>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Mantenha os dados de contato atualizados</li>
                <li>• Arquive clientes inativos para melhor organização</li>
                <li>• Adicione notas sobre preferências e histórico</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
