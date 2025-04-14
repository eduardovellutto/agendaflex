"use client"

import { useState } from "react"
import { CalendarClock } from "lucide-react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PublicBookingPageProps {
  user: User
}

export function PublicBookingPage({ user }: PublicBookingPageProps) {
  const [step, setStep] = useState<"service" | "date" | "info" | "confirmation">("service")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AgendaFlex</span>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.profession}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agendar Consulta</CardTitle>
              <CardDescription>Selecione o serviço, data e horário para agendar sua consulta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <Button
                    variant={step === "service" ? "default" : "ghost"}
                    onClick={() => setStep("service")}
                    className="rounded-full"
                  >
                    1. Serviço
                  </Button>
                  <Button
                    variant={step === "date" ? "default" : "ghost"}
                    onClick={() => setStep("date")}
                    className="rounded-full"
                    disabled={step === "service"}
                  >
                    2. Data
                  </Button>
                  <Button
                    variant={step === "info" ? "default" : "ghost"}
                    onClick={() => setStep("info")}
                    className="rounded-full"
                    disabled={step === "service" || step === "date"}
                  >
                    3. Seus dados
                  </Button>
                  <Button
                    variant={step === "confirmation" ? "default" : "ghost"}
                    onClick={() => setStep("confirmation")}
                    className="rounded-full"
                    disabled={step === "service" || step === "date" || step === "info"}
                  >
                    4. Confirmação
                  </Button>
                </div>

                {step === "service" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Selecione o serviço</h3>
                    <div className="grid gap-4">
                      {[
                        { id: "1", name: "Consulta Inicial", duration: 60, price: 150 },
                        { id: "2", name: "Sessão Regular", duration: 50, price: 120 },
                        { id: "3", name: "Avaliação Psicológica", duration: 90, price: 200 },
                      ].map((service) => (
                        <div
                          key={service.id}
                          className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:border-primary"
                          onClick={() => setStep("date")}
                        >
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.duration} minutos</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(service.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === "date" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Selecione a data e horário</h3>
                    <p className="text-sm text-muted-foreground">
                      Esta funcionalidade estará disponível em breve. Por enquanto, clique em continuar.
                    </p>
                    <Button onClick={() => setStep("info")}>Continuar</Button>
                  </div>
                )}

                {step === "info" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Seus dados</h3>
                    <p className="text-sm text-muted-foreground">
                      Esta funcionalidade estará disponível em breve. Por enquanto, clique em continuar.
                    </p>
                    <Button onClick={() => setStep("confirmation")}>Continuar</Button>
                  </div>
                )}

                {step === "confirmation" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Confirmação</h3>
                    <div className="rounded-lg border p-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Serviço:</span>
                          <span className="font-medium">Consulta Inicial</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-medium">10 de Abril de 2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário:</span>
                          <span className="font-medium">14:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-medium">R$ 150,00</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Confirmar Agendamento</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AgendaFlex. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
