"use client"

import { useState, useEffect } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingModal } from "@/components/ui/loading-modal"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { useAuth } from "@/lib/auth"
import { getAppointmentsByDate } from "@/lib/services/appointment-service"
import type { AppointmentWithClient } from "@/lib/types"

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<"day" | "week" | "month">("day")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Adicionar dias do mês anterior e próximo para completar as semanas
  const startDay = monthStart.getDay()
  const endDay = 6 - monthEnd.getDay()

  const prevMonthDays =
    startDay > 0
      ? eachDayOfInterval({
          start: addDays(monthStart, -startDay),
          end: addDays(monthStart, -1),
        })
      : []

  const nextMonthDays =
    endDay > 0
      ? eachDayOfInterval({
          start: addDays(monthEnd, 1),
          end: addDays(monthEnd, endDay),
        })
      : []

  const calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  useEffect(() => {
    async function loadAppointments() {
      if (user?.uid) {
        setIsLoading(true)
        try {
          const appointmentsData = await getAppointmentsByDate(user.uid, selectedDate)
          setAppointments(appointmentsData)
        } catch (error) {
          console.error("Erro ao carregar agendamentos:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadAppointments()
  }, [user, selectedDate])

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const refreshAppointments = async () => {
    if (user?.uid) {
      setIsLoading(true)
      try {
        const appointmentsData = await getAppointmentsByDate(user.uid, selectedDate)
        setAppointments(appointmentsData)
      } catch (error) {
        console.error("Erro ao atualizar agendamentos:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <DashboardShell>
      <LoadingModal isOpen={isLoading} message="Carregando agendamentos..." />

      <DashboardHeader heading="Agenda" text="Visualize e gerencie seus agendamentos." />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</CardTitle>
              <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day" value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
              <TabsList className="mb-4">
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>

              <TabsContent value="day" className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">
                    {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h3>
                </div>
                <AppointmentList appointments={appointments} onUpdate={refreshAppointments} />
              </TabsContent>

              <TabsContent value="week" className="space-y-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center font-medium text-sm">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(
                      selectedDate.getDay() === 0 ? selectedDate : addDays(selectedDate, -selectedDate.getDay()),
                      index,
                    )

                    return (
                      <div
                        key={index}
                        className={`calendar-day ${
                          isSameDay(date, selectedDate) ? "calendar-day-selected" : ""
                        } ${isToday(date) ? "calendar-day-today" : ""}`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <span className="text-sm">{format(date, "d")}</span>
                      </div>
                    )
                  })}
                </div>
                <AppointmentList appointments={appointments} onUpdate={refreshAppointments} />
              </TabsContent>

              <TabsContent value="month">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center font-medium text-sm">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((date, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${
                        !isSameMonth(date, currentDate) ? "calendar-day-disabled" : ""
                      } ${isSameDay(date, selectedDate) ? "calendar-day-selected" : ""} ${
                        isToday(date) ? "calendar-day-today" : ""
                      }`}
                      onClick={() => isSameMonth(date, currentDate) && handleDateSelect(date)}
                    >
                      <span className="text-sm">{format(date, "d")}</span>
                    </div>
                  ))}
                </div>
                <AppointmentList appointments={appointments} onUpdate={refreshAppointments} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
