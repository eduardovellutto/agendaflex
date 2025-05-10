"use client"

import { useState } from "react"
import { Users, CreditCard, Calendar, Clock, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Dados de exemplo
const mockStats = {
  totalUsers: 1250,
  activeSubscriptions: 850,
  totalAppointments: 3750,
  averageSessionDuration: "45 min",
  revenueThisMonth: "R$ 25.750,00",
  revenueLastMonth: "R$ 22.890,00",
  newUsersThisMonth: 120,
  newUsersLastMonth: 105,
}

export function DashboardContent() {
  const [timeframe, setTimeframe] = useState("month")

  const revenueChange =
    ((mockStats.revenueThisMonth.replace(/[^0-9]/g, "") - mockStats.revenueLastMonth.replace(/[^0-9]/g, "")) /
      mockStats.revenueLastMonth.replace(/[^0-9]/g, "")) *
    100
  const usersChange = ((mockStats.newUsersThisMonth - mockStats.newUsersLastMonth) / mockStats.newUsersLastMonth) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da plataforma e métricas importantes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setTimeframe("week")}>
            Semana
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("month")}
          >
            Mês
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeframe("year")}>
            Ano
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {usersChange > 0 ? (
                <span className="flex items-center text-green-500">
                  <TrendingUp className="mr-1 h-3 w-3" />+{usersChange.toFixed(1)}% em relação ao mês anterior
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {usersChange.toFixed(1)}% em relação ao mês anterior
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockStats.activeSubscriptions / mockStats.totalUsers) * 100)}% do total de usuários
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Totais</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Média de {(mockStats.totalAppointments / mockStats.activeSubscriptions).toFixed(1)} por usuário ativo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageSessionDuration}</div>
            <p className="text-xs text-muted-foreground">Por agendamento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>
                  Receita total para o período selecionado: {mockStats.revenueThisMonth}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de receita será exibido aqui</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Novos Usuários</CardTitle>
                <CardDescription>Total de novos usuários no período: {mockStats.newUsersThisMonth}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de usuários será exibido aqui</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.revenueThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  {revenueChange > 0 ? (
                    <span className="flex items-center text-green-500">
                      <TrendingUp className="mr-1 h-3 w-3" />+{revenueChange.toFixed(1)}% em relação ao mês anterior
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {revenueChange.toFixed(1)}% em relação ao mês anterior
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="flex items-center text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2.1% em relação ao mês anterior
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 30,28</div>
                <p className="text-xs text-muted-foreground">Por usuário ativo</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises Detalhadas</CardTitle>
              <CardDescription>Análises detalhadas sobre o uso da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Análises detalhadas serão exibidas aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Relatórios detalhados sobre a plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Relatórios serão exibidos aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
