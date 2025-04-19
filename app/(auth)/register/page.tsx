"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { createUser } from "@/lib/services/user-service"

const formSchema = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    profession: z.string().min(1, { message: "Selecione sua profissão" }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Create user in Firebase Auth
      const userCredential = await signUp(values.email, values.password)

      // Create user profile in Firestore
      if (userCredential.user) {
        try {
          await createUser({
            id: userCredential.user.uid,
            name: values.name,
            email: values.email,
            profession: values.profession,
            createdAt: new Date(),
          })

          toast({
            title: "Conta criada com sucesso",
            description: "Complete seu perfil profissional para começar a receber agendamentos.",
          })

          // Redirecionar para a página de configuração inicial do perfil
          router.push("/dashboard/profile/setup")
        } catch (firestoreError) {
          console.error("Erro ao criar perfil no Firestore:", firestoreError)
          toast({
            variant: "destructive",
            title: "Erro ao criar perfil",
            description: "Sua conta foi criada, mas houve um erro ao salvar seu perfil. Tente fazer login.",
          })
          router.push("/login")
        }
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      let errorMessage = "Verifique seus dados e tente novamente"

      // Tratamento de erros específicos do Firebase
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso. Tente fazer login ou recuperar sua senha."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O email fornecido é inválido."
      }

      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()

      // Verificar se é um novo usuário
      if (result.user && result._tokenResponse?.isNewUser) {
        // Criar perfil do usuário no Firestore para novos usuários
        await createUser({
          id: result.user.uid,
          name: result.user.displayName || "Usuário",
          email: result.user.email || "",
          profession: "other", // Valor padrão
          createdAt: new Date(),
        })

        toast({
          title: "Conta criada com sucesso",
          description: "Complete seu perfil profissional para começar a receber agendamentos.",
        })

        // Redirecionar para a página de configuração inicial do perfil
        router.push("/dashboard/profile/setup")
      } else {
        // Se não for um novo usuário, redirecionar para o dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Erro no registro com Google:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar conta com Google",
        description: "Ocorreu um erro durante a autenticação. Tente novamente.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-8">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">AgendaFlex</span>
        </div>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
