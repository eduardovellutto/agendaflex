"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarClock, ChevronLeft, ChevronRight, Clock, MapPin, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingModal } from "@/components/ui/loading-modal"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Dados de exemplo para profissionais
const professionals = [
  {
    id: "1",
    name: "Dra. Ana Silva",
    profession: "Psicóloga",
    specialties: ["Terapia Cognitivo-Comportamental", "Ansiedade", "Depressão"],
    rating: 4.9,
    reviews: 124,
    bio: "Psicóloga com mais de 10 anos de experiência em atendimento clínico. Especialista em terapia cognitivo-comportamental, com foco em tratamento de ansiedade e depressão.",
    image: "/placeholder.svg?height=300&width=300",
    location: "São Paulo, SP",
    phone: "(11) 99999-9999",
    services: [
      { id: "s1", name: "Consulta Inicial", duration: 60, price: 200 },
      { id: "s2", name: "Sessão Regular", duration: 50, price: 180 },
      { id: "s3", name: "Avaliação Psicológica", duration: 90, price: 250 },
    ],
    availability: {
      monday: { enabled: true, timeRanges: [{ start: "09:00", end: "17:00" }] },
      tuesday: { enabled: true, timeRanges: [{ start: "09:00", end: "17:00" }] },
      wednesday: { enabled: true, timeRanges: [{ start: "09:00", end: "17:00" }] },
      thursday: { enabled: true, timeRanges: [{ start: "09:00", end: "17:00" }] },
      friday: { enabled: true, timeRanges: [{ start: "09:00", end: "17:00" }] },
      saturday: { enabled: false, timeRanges: [] },
      sunday: { enabled: false, timeRanges: [] },
    },
  },
  {
    id: "2",
    name: "Dr. Carlos Mendes",
    profession: "Nutricionista",
    specialties: ["Nutrição Esportiva", "Emagrecimento", "Reeducação Alimentar"],
    rating: 4.8,
    reviews: 98,
    bio: "Nutricionista especializado em nutrição esportiva e emagrecimento. Trabalho com abordagem personalizada para cada paciente, considerando seus objetivos e estilo de vida.",
    image: "/placeholder.svg?height=300&width=300",
    location: "Rio de Janeiro, RJ",
    phone: "(21) 99999-9999",
    services: [
      { id: "s1", name: "Consulta Inicial", duration: 60, price: 180 },
      { id: "s2", name: "Consulta de Acompanhamento", duration: 45, price: 150 },
      { id: "s3", name: "Avaliação Física", duration: 90, price: 220 },
    ],
    availability: {
      monday: { enabled: true, timeRanges: [{ start: "08:00", end: "16:00" }] },
      tuesday: { enabled: true, timeRanges: [{ start: "08:00", end: "16:00" }] },
      wednesday: { enabled: true, timeRanges: [{ start: "08:00", end: "16:00" }] },
      thursday: { enabled: true, timeRanges: [{ start: "08:00", end: "16:00" }] },
      friday: { enabled: true, timeRanges: [{ start: "08:00", end: "16:00" }] },
      saturday: { enabled: true, timeRanges: [{ start: "08:00", end: "12:00" }] },
      sunday: { enabled: false, timeRanges: [] },
    },
  },
  // Outros profissionais...
]

// Gerar horários disponíveis (simulação)
const generateTimeSlots = (start: string, end: string, duration: number) => {
  const slots = []
  const startHour = Number.parseInt(start.split(":")[0])
  const startMinute = Number.parseInt(start.split(":")[1])
  const endHour = Number.parseInt(end.split(":")[0])
  const endMinute = Number.parseInt(end.split(":")[1])

  let currentHour = startHour
  let currentMinute = startMinute

  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`
    slots.push(timeString)

    currentMinute += duration
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute = currentMinute % 60
    }
  }

  return slots
}

export default function ProfessionalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [professional, setProfessional] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  // Dias da semana atual
  const weekDays = eachDayOfInterval({
    start: currentWeek,
    end: addDays(currentWeek, 6),
  })

  useEffect(() => {
    // Simular carregamento de dados do profissional
    setIsLoading(true)
    setTimeout(() => {
      const foundProfessional = professionals.find((p) => p.id === params.id)
      setProfessional(foundProfessional || null)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handlePrevWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedService || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Informações incompletas",
        description: "Por favor, selecione data, serviço e horário para agendar.",
      })
      return
    }

    setIsBooking(true)

    // Simular agendamento
    setTimeout(() => {
      setIsBooking(false)

      if (user) {
        toast({
          title: "Agendamento realizado com sucesso!",
          description: `Seu agendamento com ${professional.name} foi confirmado para ${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}.`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Agendamento realizado com sucesso!",
          description: `Seu agendamento com ${professional.name} foi confirmado para ${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}.`,
        })
        // Redirecionar para página de confirmação ou login
        router.push("/login?redirect=dashboard")
      }
    }, 2000)
  }

  // Obter horários disponíveis para a data selecionada
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !professional || !selectedService) return []

    const dayOfWeek = selectedDate.getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayAvailability = professional.availability[dayNames[dayOfWeek]]

    if (!dayAvailability.enabled || dayAvailability.timeRanges.length === 0) return []

    const service = professional.services.find((s: any) => s.id === selectedService)
    if (!service) return []

    // Gerar horários disponíveis com base na disponibilidade do profissional e duração do serviço
    let allSlots: string[] = []
    dayAvailability.timeRanges.forEach((range: any) => {
      const slots = generateTimeSlots(range.start, range.end, service.duration)
      allSlots = [...allSlots, ...slots]
    })

    // Simular alguns horários já agendados
    const bookedSlots = ["10:00", "14:00", "16:00"]
    return allSlots.filter((slot) => !bookedSlots.includes(slot))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <CalendarClock className="h-12 w-12 text-primary animate-pulse" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium">Carregando informações do profissional...</p>
        </div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
              <CalendarClock className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AgendaFlex</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:underline">
                Entrar
              </Link>
              <Link href="/register">
                <Button>Criar conta</Button>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
            <p className="mb-8">O profissional que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link href="/professionals">Ver todos os profissionais</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const availableTimeSlots = getAvailableTimeSlots()

  return (
    <div className="flex min-h-screen flex-col">
      <LoadingModal isOpen={isBooking} message="Processando seu agendamento..." />

      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AgendaFlex</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Entrar
            </Link>
            <Link href="/register">
              <Button>Criar conta</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link
              href="/professionals"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar para profissionais
            </Link>

            <div className="grid gap-8 md:grid-cols-[300px_1fr]">
              <div>
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={professional.image || "/placeholder.svg"}
                    alt={professional.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">{professional.name}</h1>
                <p className="text-lg text-gray-500 mb-4">{professional.profession}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{professional.rating}</span>
                  <span className="text-gray-500">({professional.reviews} avaliações)</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {professional.specialties.map((specialty: string) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span>{professional.phone}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-2">Sobre</h2>
                  <p>{professional.bio}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Agende uma consulta</h2>

            <Tabs defaultValue="services">
              <TabsList className="mb-6">
                <TabsTrigger value="services">1. Selecione o serviço</TabsTrigger>
                <TabsTrigger value="date" disabled={!selectedService}>
                  2. Escolha a data
                </TabsTrigger>
                <TabsTrigger value="time" disabled={!selectedDate || !selectedService}>
                  3. Escolha o horário
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {professional.services.map((service: any) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer card-hover ${selectedService === service.id ? "border-primary" : ""}`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.duration} minutos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.price)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedService && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => document.querySelector('[data-value="date"]')?.click()}>
                      Continuar para escolha da data
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="date">
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
                    <div>
                      <CardTitle>Selecione uma data</CardTitle>
                      <CardDescription>Escolha o dia para seu agendamento</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))}
                      >
                        Hoje
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                        <div key={day} className="text-center font-medium text-sm">
                          {day}
                        </div>
                      ))}

                      {weekDays.map((date, index) => {
                        const dayOfWeek = date.getDay()
                        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
                        const dayAvailability = professional.availability[dayNames[dayOfWeek]]
                        const isAvailable = dayAvailability.enabled

                        return (
                          <div
                            key={index}
                            className={`calendar-day ${
                              !isAvailable ? "calendar-day-disabled" : ""
                            } ${isSameDay(date, selectedDate || new Date()) ? "calendar-day-selected" : ""} ${
                              isToday(date) ? "calendar-day-today" : ""
                            }`}
                            onClick={() => isAvailable && handleDateSelect(date)}
                          >
                            <span className="text-sm">{format(date, "d")}</span>
                            <span className="text-xs">{format(date, "MMM", { locale: ptBR })}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => document.querySelector('[data-value="services"]')?.click()}
                    >
                      Voltar
                    </Button>
                    {selectedDate && (
                      <Button onClick={() => document.querySelector('[data-value="time"]')?.click()}>
                        Continuar para escolha do horário
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="time">
                <Card>
                  <CardHeader>
                    <CardTitle>Selecione um horário</CardTitle>
                    <CardDescription>
                      Horários disponíveis para{" "}
                      {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableTimeSlots.map((time) => (
                          <div
                            key={time}
                            className={`time-slot ${selectedTime === time ? "time-slot-selected" : ""}`}
                            onClick={() => handleTimeSelect(time)}
                          >
                            <div className="flex items-center justify-center">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Não há horários disponíveis para esta data.</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.querySelector('[data-value="date"]')?.click()}
                        >
                          Escolher outra data
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => document.querySelector('[data-value="date"]')?.click()}>
                      Voltar
                    </Button>
                    <Button disabled={!selectedTime} onClick={handleBookAppointment}>
                      Confirmar agendamento
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 md:py-12 bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">AgendaFlex</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
            <Link href="#" className="text-sm hover:text-primary">
              Sobre nós
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Termos de uso
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Política de privacidade
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Contato
            </Link>
          </div>
          <p className="text-center text-sm text-gray-400 md:text-left">
            &copy; {new Date().getFullYear()} AgendaFlex. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
