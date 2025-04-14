"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/services/user-service"

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  profession: z.string().min(1, { message: "Selecione sua profissão" }),
  bio: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
})

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  whatsappNotifications: z.boolean(),
  reminderTime: z.string(),
})

export default function SettingsPage() {
  const { toast } = useToast()
  const { user: authUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      bio: "",
      phone: "",
      website: "",
    },
  })

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: true,
      reminderTime: "24",
    },
  })

  useEffect(() => {
    async function loadUserData() {
      if (authUser?.uid) {
        setIsLoading(true)
        try {
          const userData = await getUserById(authUser.uid)
          if (userData) {
            profileForm.reset({
              name: userData.name,
              email: userData.email,
              profession: userData.profession,
              bio: userData.bio || "",
              phone: userData.phone || "",
              website: userData.website || "",
            })

            notificationsForm.reset({
              emailNotifications: userData.notifications?.email || true,
              smsNotifications: userData.notifications?.sms || false,
              whatsappNotifications: userData.notifications?.whatsapp || true,
              reminderTime: userData.notifications?.reminderTime || "24",
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
  }, [authUser, profileForm, notificationsForm])

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
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
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      })
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

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    if (!authUser?.uid) return

    setIsLoading(true)
    try {
      await updateUser(authUser.uid, {
        notifications: {
          email: values.emailNotifications,
          sms: values.smsNotifications,
          whatsapp: values.whatsappNotifications,
          reminderTime: values.reminderTime,
        },
      })

      toast({
        title: "Notificações atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar notificações",
        description: "Ocorreu um erro ao atualizar suas preferências de notificação. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Configurações" text="Gerencie suas configurações de perfil e notificações." />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Atualize suas informações de perfil.</CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} disabled />
                        </FormControl>
                        <FormDescription>Para alterar seu email, entre em contato com o suporte.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione sua profissão">
                                {field.value === "psychologist" && "Psicólogo(a)"}
                                {field.value === "lawyer" && "Advogado(a)"}
                                {field.value === "personal_trainer" && "Personal Trainer"}
                                {field.value === "nutritionist" && "Nutricionista"}
                                {field.value === "coach" && "Coach"}
                                {field.value === "therapist" && "Terapeuta"}
                                {field.value === "other" && "Outro"}
                              </SelectValue>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte um pouco sobre você e sua experiência profissional..."
                            className="resize-none"
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
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://seusite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure como você deseja receber notificações.</CardDescription>
            </CardHeader>
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormDescription>
                            Receba notificações por email sobre novos agendamentos e lembretes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">SMS</FormLabel>
                          <FormDescription>
                            Receba notificações por SMS sobre novos agendamentos e lembretes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="whatsappNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">WhatsApp</FormLabel>
                          <FormDescription>
                            Receba notificações por WhatsApp sobre novos agendamentos e lembretes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="reminderTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de lembrete</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tempo de lembrete">
                                {field.value === "1" && "1 hora antes"}
                                {field.value === "2" && "2 horas antes"}
                                {field.value === "6" && "6 horas antes"}
                                {field.value === "12" && "12 horas antes"}
                                {field.value === "24" && "1 dia antes"}
                                {field.value === "48" && "2 dias antes"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 hora antes</SelectItem>
                            <SelectItem value="2">2 horas antes</SelectItem>
                            <SelectItem value="6">6 horas antes</SelectItem>
                            <SelectItem value="12">12 horas antes</SelectItem>
                            <SelectItem value="24">1 dia antes</SelectItem>
                            <SelectItem value="48">2 dias antes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Quanto tempo antes do agendamento você deseja enviar lembretes para seus clientes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar preferências"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
