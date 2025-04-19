"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarClock, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  },
  {
    id: "3",
    name: "Mariana Costa",
    profession: "Personal Trainer",
    specialties: ["Musculação", "Funcional", "Pilates"],
    rating: 4.7,
    reviews: 87,
    bio: "Personal trainer com formação em educação física e especialização em treinamento funcional. Desenvolvo programas personalizados para atingir objetivos específicos.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Dr. Roberto Alves",
    profession: "Terapeuta",
    specialties: ["Terapia de Casal", "Terapia Familiar", "Ansiedade"],
    rating: 5.0,
    reviews: 56,
    bio: "Terapeuta com abordagem humanista e sistêmica. Especialista em terapia de casal e familiar, ajudando a resolver conflitos e melhorar relacionamentos.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "5",
    name: "Dra. Juliana Ferreira",
    profession: "Psicóloga",
    specialties: ["Psicanálise", "Traumas", "Autoconhecimento"],
    rating: 4.9,
    reviews: 112,
    bio: "Psicóloga com abordagem psicanalítica. Trabalho com foco em traumas e autoconhecimento, ajudando pacientes a compreenderem melhor seus comportamentos e emoções.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "6",
    name: "Dr. Fernando Santos",
    profession: "Fisioterapeuta",
    specialties: ["Fisioterapia Esportiva", "Reabilitação", "RPG"],
    rating: 4.8,
    reviews: 76,
    bio: "Fisioterapeuta especializado em reabilitação e fisioterapia esportiva. Utilizo técnicas modernas para recuperação de lesões e melhoria da performance física.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [professionFilter, setProfessionFilter] = useState("")

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesProfession = professionFilter ? professional.profession === professionFilter : true

    return matchesSearch && matchesProfession
  })

  const uniqueProfessions = Array.from(new Set(professionals.map((p) => p.profession)))

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
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Encontre o profissional ideal
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Busque por nome, especialidade ou filtre por profissão para encontrar o profissional perfeito para você.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar por nome ou especialidade..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={professionFilter} onValueChange={setProfessionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por profissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as profissões</SelectItem>
                {uniqueProfessions.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.length > 0 ? (
              filteredProfessionals.map((professional) => (
                <Link href={`/professionals/${professional.id}`} key={professional.id}>
                  <Card className="h-full card-hover">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full">
                          <img
                            src={professional.image || "/placeholder.svg"}
                            alt={professional.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{professional.name}</CardTitle>
                          <CardDescription>{professional.profession}</CardDescription>
                          <div className="mt-1 flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{professional.rating}</span>
                            <span className="text-sm text-gray-500">({professional.reviews} avaliações)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-500 line-clamp-3 mb-3">{professional.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {professional.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
                <p className="text-gray-500">
                  Tente ajustar seus filtros ou termos de busca para encontrar mais resultados.
                </p>
              </div>
            )}
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
