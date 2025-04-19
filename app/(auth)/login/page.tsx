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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { createUser, getUserById } from "@/lib/services/user-service"
import { isProfileComplete } from "@/lib/utils/profile-validation"

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
})

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Modificar a função checkProfileAndRedirect para garantir que o redirecionamento seja sempre para o dashboard
  async function checkProfileAndRedirect(userId: string) {
    try {
      const userProfile = await getUserById(userId)

      if (!isProfileComplete(userProfile)) {
        // Se o perfil não estiver completo, redireciona para a página de configuração inicial
        toast({
          title: "Complete seu perfil",
          description: "Por favor, complete seu perfil profissional para continuar.",
        })
        router.push("/dashboard/profile/setup")
      } else {
        // Se o perfil estiver completo, redireciona para o dashboard
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error)
      // Em caso de erro, redireciona para o dashboard
      router.push("/dashboard")
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await signIn(values.email, values.password)

      if (result.user) {
        await checkProfileAndRedirect(result.user.uid)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
      })
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

        // Redirecionar para a página de configuração inicial
        toast({
          title: "Conta criada com sucesso",
          description: "Por favor, complete seu perfil profissional para continuar.",
        })
        router.push("/dashboard/profile/setup")
      } else if (result.user) {
        // Verificar se o perfil está completo
        await checkProfileAndRedirect(result.user.uid)
      }
    } catch (error) {
      console.error("Erro no login com Google:", error)
      toast({
        variant: "destructive",
        title: "Erro ao fazer login com Google",
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
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Entre com seu email e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
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
        <CardFooter className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="underline underline-offset-4 hover:text-primary">
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
