import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock, CheckCircle, Clock, CreditCard, Search, Star, Users } from "lucide-react"

// Dados de exemplo para profissionais em destaque
const featuredProfessionals = [
  {
    id: "1",
    name: "Dra. Ana Silva",
    profession: "Psicóloga",
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "Dr. Carlos Mendes",
    profession: "Nutricionista",
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Mariana Costa",
    profession: "Personal Trainer",
    rating: 4.7,
    reviews: 87,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Dr. Roberto Alves",
    profession: "Terapeuta",
    rating: 5.0,
    reviews: 56,
    image: "/placeholder.svg?height=300&width=300",
  },
]

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
        <section className="gradient-bg py-16 md:py-24 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Simplifique seus agendamentos
                  </h1>
                  <p className="text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    AgendaFlex é a solução completa para profissionais liberais gerenciarem agendamentos, clientes e
                    pagamentos em um só lugar.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                      Começar agora
                    </Button>
                  </Link>
                  <Link href="/professionals" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar profissionais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md rounded-lg border bg-white p-4 shadow-lg">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Agenda de Hoje</h3>
                        <span className="text-sm text-gray-500">Segunda, 10 Abril</span>
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
                              <p className="font-medium text-gray-900">{appointment.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{appointment.time}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{appointment.service}</span>
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
          </div>
        </section>

        <section id="features" className="container mx-auto py-16 md:py-24 px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos</h2>
            <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Tudo o que você precisa para gerenciar sua agenda profissional
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm card-hover">
              <div className="rounded-full bg-primary/10 p-3">
                <CalendarClock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Agenda Online</h3>
              <p className="text-center text-gray-500">
                Gerencie sua disponibilidade e permita que clientes agendem diretamente pelo site.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm card-hover">
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Pagamentos</h3>
              <p className="text-center text-gray-500">
                Integração com Pix e cartão de crédito para receber pagamentos automaticamente.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 shadow-sm card-hover">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Lembretes</h3>
              <p className="text-center text-gray-500">
                Notificações automáticas por WhatsApp e email para reduzir faltas.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Profissionais em Destaque</h2>
              <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conheça alguns dos profissionais disponíveis para agendamento
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProfessionals.map((professional) => (
                <Link href={`/professionals/${professional.id}`} key={professional.id}>
                  <div className="rounded-lg border bg-background p-4 shadow-sm card-hover">
                    <div className="aspect-square overflow-hidden rounded-lg mb-4">
                      <img
                        src={professional.image || "/placeholder.svg"}
                        alt={professional.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold">{professional.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{professional.profession}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{professional.rating}</span>
                      <span className="text-sm text-gray-500">({professional.reviews} avaliações)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/professionals">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Users className="mr-2 h-4 w-4" />
                  Ver todos os profissionais
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
