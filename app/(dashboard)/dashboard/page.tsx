"use client"

import { useEffect, useState } from "react"
import { CalendarClock, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { useAuth } from "@/lib/auth"
import { getAppointmentsByDate, getAppointmentStats, getUpcomingAppointments } from "@/lib/services/appointment-service"
import type { AppointmentWithClient } from "@/lib/types"
import { UsageProgress } from "@/components/subscription/usage-progress"
import { getClientsByProfessional } from "@/lib/services/client-service"
import { getServicesByProfessional } from "@/lib/services/service-service"

export default function DashboardPage() {
  const { user } = useAuth()
  const [todayAppointments, setTodayAppointments] = useState<AppointmentWithClient[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithClient[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [clientCount, setClientCount] = useState(0)
  const [serviceCount, setServiceCount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        setIsLoading(true)
        try {
          // Get today's appointments
          const today = new Date()
          const appointments = await getAppointmentsByDate(user.uid, today)
          setTodayAppointments(appointments)

          // Get upcoming appointments
          const upcoming = await getUpcomingAppointments(user.uid, 5)
          setUpcomingAppointments(upcoming)

          // Get stats
          const statsData = await getAppointmentStats(user.uid)
          setStats(statsData)

          // Get client and service counts
          const clients = await getClientsByProfessional(user.uid)
          setClientCount(clients.length)

          const services = await getServicesByProfessional(user.uid)
          setServiceCount(services.length)
        } catch (error) {
          console.error("Error loading dashboard data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [user])

  const refreshData = async () => {
    if (user?.uid) {
      try {
        // Refresh today's appointments
        const today = new Date()
        const appointments = await getAppointmentsByDate(user.uid, today)
        setTodayAppointments(appointments)

        // Refresh upcoming appointments
        const upcoming = await getUpcomingAppointments(user.uid, 5)
        setUpcomingAppointments(upcoming)

        // Refresh stats
        const statsData = await getAppointmentStats(user.uid)
        setStats(statsData)
      } catch (error) {
        console.error("Error refreshing dashboard data:", error)
      }
    }
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Agendamentos registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Concluídos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Atendimentos realizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Agendamentos pendentes</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Uso de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageProgress resourceType="clients" currentCount={clientCount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Uso de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageProgress resourceType="services" currentCount={serviceCount} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4">
            <AppointmentList appointments={todayAppointments} onUpdate={refreshData} />
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            <AppointmentList appointments={upcomingAppointments} onUpdate={refreshData} />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
