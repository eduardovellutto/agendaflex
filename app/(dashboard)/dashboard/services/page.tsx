"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ServiceList } from "@/components/services/service-list"
import { useAuth } from "@/lib/auth"
import { getServicesByProfessional } from "@/lib/services/service-service"
import type { Service } from "@/lib/types/service"

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      if (user?.uid) {
        setIsLoading(true)
        try {
          const servicesData = await getServicesByProfessional(user.uid)
          setServices(servicesData)
          setFilteredServices(servicesData)
        } catch (error) {
          console.error("Error loading services:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadServices()
  }, [user])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = services.filter(
        (service) => service.name.toLowerCase().includes(query) || service.description?.toLowerCase().includes(query),
      )
      setFilteredServices(filtered)
    }
  }, [searchQuery, services])

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Serviços" text="Gerencie os serviços que você oferece aos seus clientes.">
        <Link href="/dashboard/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Button>
        </Link>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Meus Serviços</CardTitle>
          <CardDescription>Você tem um total de {services.length} serviços cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar serviços..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ServiceList services={filteredServices} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
