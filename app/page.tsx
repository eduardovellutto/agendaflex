import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock, CheckCircle, Clock, CreditCard } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AgendaFlex</span>
          </div>
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
      <main className="flex-1">
        <section className="container mx-auto py-12 md:py-24 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simplifique seus agendamentos
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AgendaFlex é a solução completa para profissionais liberais gerenciarem agendamentos, clientes e
                  pagamentos em um só lugar.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Começar agora
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary/20 to-primary/5 p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-md rounded-lg border bg-background p-4 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">Agenda de Hoje</h3>
                      <span className="text-sm text-muted-foreground">Segunda, 10 Abril</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { time: "09:00", name: "Ana Silva", service: "Consulta Inicial" },
                        { time: "11:30", name: "Carlos Mendes", service: "Sessão Regular" },
                        { time: "14:00", name: "Mariana Costa", service: "Avaliação" },
                      ].map((appointment, i) => (
                        <div key={i} className="flex items-center rounded-lg border p-3">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{appointment.time}</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{appointment.service}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="container mx-auto py-12 md:py-24 px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos</h2>
            <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tudo o que você precisa para gerenciar sua agenda profissional
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm">
              <CalendarClock className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Agenda Online</h3>
              <p className="text-center text-gray-500">
                Gerencie sua disponibilidade e permita que clientes agendem diretamente pelo site.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm">
              <CreditCard className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Pagamentos</h3>
              <p className="text-center text-gray-500">
                Integração com Pix e cartão de crédito para receber pagamentos automaticamente.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm">
              <CheckCircle className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Lembretes</h3>
              <p className="text-center text-gray-500">
                Notificações automáticas por WhatsApp e email para reduzir faltas.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">AgendaFlex</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} AgendaFlex. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
