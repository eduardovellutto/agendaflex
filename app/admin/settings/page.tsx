"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AgendaFlex",
    siteDescription: "Sistema de agendamento para profissionais",
    supportEmail: "suporte@agendaflex.com",
  })

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    trialDays: 15,
    enableAutoRenewal: true,
    sendExpirationReminders: true,
    daysBeforeExpirationReminder: 3,
  })

  const [emailSettings, setEmailSettings] = useState({
    enableEmailNotifications: true,
    welcomeEmailEnabled: true,
    subscriptionEmailsEnabled: true,
    reminderEmailsEnabled: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSubscriptionSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean, settingsType: string) => {
    if (settingsType === "subscription") {
      setSubscriptionSettings((prev) => ({ ...prev, [name]: checked }))
    } else if (settingsType === "email") {
      setEmailSettings((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Aqui seria implementada a lógica para salvar as configurações
      // Por enquanto, apenas simulamos o salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram salvas com sucesso.",
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Gerencie as configurações globais da plataforma.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="subscription">Assinaturas</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input id="siteName" name="siteName" value={generalSettings.siteName} onChange={handleGeneralChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de Suporte</Label>
                <Input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={handleGeneralChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Assinatura</CardTitle>
              <CardDescription>Configure as opções relacionadas às assinaturas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trialDays">Dias de Teste Gratuito</Label>
                <Input
                  id="trialDays"
                  name="trialDays"
                  type="number"
                  min="0"
                  max="30"
                  value={subscriptionSettings.trialDays}
                  onChange={handleSubscriptionChange}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableAutoRenewal">Habilitar Renovação Automática</Label>
                <Switch
                  id="enableAutoRenewal"
                  checked={subscriptionSettings.enableAutoRenewal}
                  onCheckedChange={(checked) => handleSwitchChange("enableAutoRenewal", checked, "subscription")}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sendExpirationReminders">Enviar Lembretes de Expiração</Label>
                <Switch
                  id="sendExpirationReminders"
                  checked={subscriptionSettings.sendExpirationReminders}
                  onCheckedChange={(checked) => handleSwitchChange("sendExpirationReminders", checked, "subscription")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daysBeforeExpirationReminder">Dias Antes para Enviar Lembrete</Label>
                <Input
                  id="daysBeforeExpirationReminder"
                  name="daysBeforeExpirationReminder"
                  type="number"
                  min="1"
                  max="30"
                  value={subscriptionSettings.daysBeforeExpirationReminder}
                  onChange={handleSubscriptionChange}
                  disabled={!subscriptionSettings.sendExpirationReminders}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>Configure as opções de notificações por email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableEmailNotifications">Habilitar Notificações por Email</Label>
                <Switch
                  id="enableEmailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("enableEmailNotifications", checked, "email")}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="welcomeEmailEnabled">Email de Boas-vindas</Label>
                <Switch
                  id="welcomeEmailEnabled"
                  checked={emailSettings.welcomeEmailEnabled}
                  onCheckedChange={(checked) => handleSwitchChange("welcomeEmailEnabled", checked, "email")}
                  disabled={!emailSettings.enableEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="subscriptionEmailsEnabled">Emails de Assinatura</Label>
                <Switch
                  id="subscriptionEmailsEnabled"
                  checked={emailSettings.subscriptionEmailsEnabled}
                  onCheckedChange={(checked) => handleSwitchChange("subscriptionEmailsEnabled", checked, "email")}
                  disabled={!emailSettings.enableEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="reminderEmailsEnabled">Emails de Lembrete</Label>
                <Switch
                  id="reminderEmailsEnabled"
                  checked={emailSettings.reminderEmailsEnabled}
                  onCheckedChange={(checked) => handleSwitchChange("reminderEmailsEnabled", checked, "email")}
                  disabled={!emailSettings.enableEmailNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Configure opções avançadas do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Funcionalidade em desenvolvimento.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
