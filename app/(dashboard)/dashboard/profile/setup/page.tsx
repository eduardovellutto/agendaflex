"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/services/user-service"
import { CalendarClock, CheckCircle2 } from "lucide-react"

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  profession: z.string().min(1, { message: "Selecione sua profissão" }),
  bio: z.string().min(10, { message: "Descreva sua experiência profissional (mínimo 10 caracteres)" }),
  phone: z.string().min(10, { message: "Informe um telefone válido" }),
  website: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
})

export default function ProfileSetupPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user: authUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      profession: "",
      bio: "",
      phone: "",
      website: "",
    },
  })

  useEffect(() => {
    async function loadUserData() {
      if (authUser?.uid) {
        setIsLoading(true)
        try {
          console.log("Carregando dados do usuário:", authUser.uid)
          const userData = await getUserById(authUser.uid)
          console.log("Dados do usuário carregados:", userData)

          if (userData) {
            form.reset({
              name: userData.name || authUser.displayName || "",
              profession: userData.profession || "",
              bio: userData.bio || "",
              phone: userData.phone || "",
              website: userData.website || "",
            })
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadUserData()
  }, [authUser, form])

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!authUser?.uid) return

    setIsLoading(true)
    try {
      console.log("Atualizando perfil do usuário:", values)
      await updateUser(authUser.uid, {
        name: values.name,
        profession: values.profession,
        bio: values.bio,
        phone: values.phone,
        website: values.website,
      })

      toast({
        title: "Perfil atualizado com sucesso",
        description: "Agora você pode começar a receber agendamentos.",
      })

      // Redirecionar para o dashboard após completar o perfil
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Bem-vindo ao AgendaFlex</CardTitle>
              <CardDescription>
                Vamos configurar seu perfil profissional para que você possa começar a receber agendamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">O que você pode fazer com o AgendaFlex:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                    <span>Gerenciar seus clientes e agendamentos em um só lugar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                    <span>Configurar sua disponibilidade e serviços oferecidos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                    <span>Receber notificações de novos agendamentos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                    <span>Acompanhar seu histórico de atendimentos e receita</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={nextStep}>
                Vamos começar
              </Button>
            </CardFooter>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Informações básicas</CardTitle>
              <CardDescription>
                Preencha suas informações profissionais para que seus clientes possam te conhecer melhor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormDescription>Este é o nome que será exibido para seus clientes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua profissão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="psychologist">Psicólogo(a)</SelectItem>
                        <SelectItem value="lawyer">Advogado(a)</SelectItem>
                        <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                        <SelectItem value="nutritionist">Nutricionista</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="therapist">Terapeuta</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Escolha a profissão que melhor descreve sua atividade.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de contato</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormDescription>Número para contato com clientes e notificações.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Voltar
              </Button>
              <Button onClick={nextStep}>Próximo</Button>
            </CardFooter>
          </>
        )
      case 3:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Detalhes profissionais</CardTitle>
                <CardDescription>
                  Adicione mais informações sobre sua experiência e serviços oferecidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia profissional</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva sua experiência, especialidades e abordagem profissional..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta informação será exibida na sua página pública de agendamento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website ou Rede Social</FormLabel>
                      <FormControl>
                        <Input placeholder="https://seusite.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Opcional: Adicione seu site ou perfil profissional em redes sociais.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep} type="button">
                  Voltar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Concluir"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )
      default:
        return null
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AgendaFlex</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep === step
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-muted bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : <span>{step}</span>}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    currentStep === step ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step === 1 ? "Bem-vindo" : step === 2 ? "Informações" : "Detalhes"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 w-full bg-muted">
            <div
              className="h-1 bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <Card className="w-full">{renderStepContent()}</Card>
      </div>
    </div>
  )
}
