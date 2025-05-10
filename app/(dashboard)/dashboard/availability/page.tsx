"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TimeRangePicker } from "@/components/availability/time-range-picker"
import { useAuth } from "@/lib/auth"
import { getAvailabilityByProfessional, updateAvailability } from "@/lib/services/availability-service"
import type { Availability } from "@/lib/types/availability"
import { LoadingSpinner } from "@/components/loading-spinner"

const weekdays = [
  { id: "monday", label: "Segunda-feira" },
  { id: "tuesday", label: "Terça-feira" },
  { id: "wednesday", label: "Quarta-feira" },
  { id: "thursday", label: "Quinta-feira" },
  { id: "friday", label: "Sexta-feira" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
]

const timeRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
})

const dayAvailabilitySchema = z.object({
  enabled: z.boolean(),
  timeRanges: z.array(timeRangeSchema),
})

const availabilityFormSchema = z.object({
  monday: dayAvailabilitySchema,
  tuesday: dayAvailabilitySchema,
  wednesday: dayAvailabilitySchema,
  thursday: dayAvailabilitySchema,
  friday: dayAvailabilitySchema,
  saturday: dayAvailabilitySchema,
  sunday: dayAvailabilitySchema,
  appointmentDuration: z.string(),
  breakBetweenAppointments: z.string(),
})

export default function AvailabilityPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [availabilityData, setAvailabilityData] = useState<z.infer<typeof availabilityFormSchema> | null>(null)

  const form = useForm<z.infer<typeof availabilityFormSchema>>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      monday: { enabled: false, timeRanges: [{ start: "09:00", end: "17:00" }] },
      tuesday: { enabled: false, timeRanges: [{ start: "09:00", end: "17:00" }] },
      wednesday: { enabled: false, timeRanges: [{ start: "09:00", end: "17:00" }] },
      thursday: { enabled: false, timeRanges: [{ start: "09:00", end: "17:00" }] },
      friday: { enabled: false, timeRanges: [{ start: "09:00", end: "17:00" }] },
      saturday: { enabled: false, timeRanges: [{ start: "09:00", end: "13:00" }] },
      sunday: { enabled: false, timeRanges: [{ start: "09:00", end: "13:00" }] },
      appointmentDuration: "60",
      breakBetweenAppointments: "15",
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function loadAvailability() {
      if (user?.uid) {
        setIsLoading(true)
        try {
          const availability = await getAvailabilityByProfessional(user.uid)
          if (availability) {
            setAvailabilityData({
              ...availability,
              appointmentDuration: availability.appointmentDuration.toString(),
              breakBetweenAppointments: availability.breakBetweenAppointments.toString(),
            })
          }
        } catch (error) {
          console.error("Error loading availability:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isMounted && user) {
      loadAvailability()
    }
  }, [user, isMounted])

  useEffect(() => {
    if (availabilityData) {
      form.reset(availabilityData)
    }
  }, [availabilityData, form])

  async function onSubmit(values: z.infer<typeof availabilityFormSchema>) {
    if (!user?.uid) return

    setIsLoading(true)
    try {
      const availability: Availability = {
        professionalId: user.uid,
        ...values,
        appointmentDuration: Number.parseInt(values.appointmentDuration),
        breakBetweenAppointments: Number.parseInt(values.breakBetweenAppointments),
      }

      await updateAvailability(availability)

      toast({
        title: "Disponibilidade atualizada",
        description: "Sua disponibilidade foi atualizada com sucesso.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar disponibilidade",
        description: "Ocorreu um erro ao atualizar sua disponibilidade. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Se não estiver montado (lado do servidor), retorne um placeholder ou null
  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Disponibilidade" text="Configure sua disponibilidade para atendimentos." />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
              <CardDescription>
                Configure os dias e horários em que você está disponível para atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {weekdays.map((day) => (
                <div key={day.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`${day.id}.enabled` as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base">{day.label}</FormLabel>
                          <FormDescription>Marque para disponibilizar este dia para agendamentos.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch(`${day.id}.enabled` as any) && (
                    <FormField
                      control={form.control}
                      name={`${day.id}.timeRanges` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TimeRangePicker value={field.value} onChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
              <CardDescription>
                Configure a duração padrão dos seus atendimentos e o intervalo entre eles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="appointmentDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração padrão do atendimento</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a duração">
                            {field.value ? `${field.value} minutos` : ""}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Esta será a duração padrão para todos os seus atendimentos.</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breakBetweenAppointments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo entre atendimentos</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o intervalo">
                            {field.value ? `${field.value} minutos` : ""}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Sem intervalo</SelectItem>
                        <SelectItem value="5">5 minutos</SelectItem>
                        <SelectItem value="10">10 minutos</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Este será o tempo de intervalo entre um atendimento e outro.</FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar configurações"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
