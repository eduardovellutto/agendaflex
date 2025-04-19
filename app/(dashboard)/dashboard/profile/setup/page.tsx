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
          const userData = await getUserById(authUser.uid)
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
          console.error("Error loading user data:", error)
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
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configure seu perfil profissional</CardTitle>
          <CardDescription>
            Complete seu perfil para que os clientes possam encontrar e agendar horários com você.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar e continuar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
