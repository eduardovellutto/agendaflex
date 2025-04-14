"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ClientList } from "@/components/clients/client-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth"
import { getClientsByProfessional } from "@/lib/services/client-service"
import type { Client } from "@/lib/types/client"

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadClients() {
      if (user?.uid) {
        setIsLoading(true)
        try {
          const clientsData = await getClientsByProfessional(user.uid)
          setClients(clientsData)
          setFilteredClients(clientsData)
        } catch (error) {
          console.error("Error loading clients:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadClients()
  }, [user])

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

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Clientes" text="Gerencie seus clientes e veja o histórico de atendimentos.">
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Meus Clientes</CardTitle>
          <CardDescription>Você tem um total de {clients.length} clientes cadastrados.</CardDescription>
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
          <ClientList clients={filteredClients} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
