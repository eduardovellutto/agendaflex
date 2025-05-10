"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Configurações de exemplo
  const [settings, setSettings] = useState({
    general: {
      siteName: "AgendaFlex",
      siteDescription: "Sistema de agendamento para profissionais",
      supportEmail: "suporte@agendaflex.com",
    },
    notifications: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      adminNotifications: true,
    },
    security: {
      requireEmailVerification: true,
      twoFactorAuth: false,
      passwordMinLength: "8",
      sessionTimeout: "30",
    },
    appearance: {
      primaryColor: "#7C3AED",
      logoUrl: "",
      faviconUrl: "",
    },
  })

  // Garantir que estamos no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Não renderizar nada durante o SSR para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Aqui seria implementada a lógica para salvar as configurações
      // Por enquanto, apenas simulamos o salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configurações salvas",
        description: "As configurações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações. Tente novamente mais tarde.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSettings = (category: keyof typeof settings, field: string, value: any) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Gerencie as configurações globais da plataforma.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do Site</Label>
                <Input
                  id="site-name"
                  value={settings.general.siteName}
                  onChange={(e) => updateSettings("general", "siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição do Site</Label>
                <Textarea
                  id="site-description"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings("general", "siteDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Email de Suporte</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={(e) => updateSettings("general", "supportEmail", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure como as notificações são enviadas aos usuários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.enableEmailNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "enableEmailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.enableSmsNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "enableSmsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-notifications">Notificações para Administradores</Label>
                <Switch
                  id="admin-notifications"
                  checked={settings.notifications.adminNotifications}
                  onCheckedChange={(checked) => updateSettings("notifications", "adminNotifications", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure as opções de segurança da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-verification">Verificação de Email</Label>
                <Switch
                  id="email-verification"
                  checked={settings.security.requireEmailVerification}
                  onCheckedChange={(checked) => updateSettings("security", "requireEmailVerification", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor-auth">Autenticação de Dois Fatores</Label>
                <Switch
                  id="two-factor-auth"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSettings("security", "twoFactorAuth", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-min-length">Tamanho Mínimo da Senha</Label>
                <Input
                  id="password-min-length"
                  type="number"
                  min="6"
                  max="20"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSettings("security", "passwordMinLength", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings("security", "sessionTimeout", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>Personalize a aparência da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    className="w-12 h-8 p-1"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                  />
                  <Input
                    type="text"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-url">URL do Logo</Label>
                <Input
                  id="logo-url"
                  placeholder="https://exemplo.com/logo.png"
                  value={settings.appearance.logoUrl}
                  onChange={(e) => updateSettings("appearance", "logoUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon-url">URL do Favicon</Label>
                <Input
                  id="favicon-url"
                  placeholder="https://exemplo.com/favicon.ico"
                  value={settings.appearance.faviconUrl}
                  onChange={(e) => updateSettings("appearance", "faviconUrl", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
