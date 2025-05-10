"use client"

import { useState } from "react"
import { Bell, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function NotificationsContent() {
  const [notificationType, setNotificationType] = useState<"all" | "trial" | "expiring" | "custom">("all")
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o título e a mensagem da notificação.",
      })
      return
    }

    setIsSending(true)
    try {
      // Aqui seria implementada a lógica para enviar notificações
      // Por enquanto, apenas simulamos o envio
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Notificação enviada",
        description: `A notificação foi enviada com sucesso para os usuários ${
          notificationType === "all"
            ? "selecionados"
            : notificationType === "trial"
              ? "em período de teste"
              : notificationType === "expiring"
                ? "com assinatura prestes a expirar"
                : "selecionados"
        }.`,
      })

      // Limpar o formulário
      setNotificationTitle("")
      setNotificationMessage("")
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação. Tente novamente mais tarde.",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notificações do Sistema</h2>
        <p className="text-muted-foreground">Envie notificações para os usuários da plataforma.</p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Enviar Notificações</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Notificação</CardTitle>
              <CardDescription>Envie notificações para grupos específicos de usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-type">Destinatários</Label>
                <Select value={notificationType} onValueChange={(value) => setNotificationType(value as any)}>
                  <SelectTrigger id="notification-type">
                    <SelectValue placeholder="Selecione os destinatários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    <SelectItem value="trial">Usuários em período de teste</SelectItem>
                    <SelectItem value="expiring">Assinaturas prestes a expirar</SelectItem>
                    <SelectItem value="custom">Seleção personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-title">Título</Label>
                <Input
                  id="notification-title"
                  placeholder="Título da notificação"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-message">Mensagem</Label>
                <Textarea
                  id="notification-message"
                  placeholder="Digite a mensagem da notificação..."
                  rows={5}
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSendNotification} disabled={isSending}>
                {isSending ? (
                  <>
                    <Bell className="mr-2 h-4 w-4 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Notificação
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Notificação</CardTitle>
              <CardDescription>Gerencie templates para envio rápido de notificações.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Funcionalidade em desenvolvimento.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Notificações</CardTitle>
              <CardDescription>Visualize o histórico de notificações enviadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Nenhuma notificação enviada recentemente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
