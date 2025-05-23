"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarClock,
  CalendarDays,
  Clock,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  Bell,
  Search,
  ChevronDown,
  BarChart,
  LogInIcon as Subscription,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoadingModal } from "@/components/ui/loading-modal"
import { SubscriptionBanner } from "@/components/subscription/subscription-banner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Agenda",
    href: "/dashboard/calendar",
    icon: CalendarDays,
    badge: "Hoje",
    badgeColor: "bg-blue-500",
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Serviços",
    href: "/dashboard/services",
    icon: Clock,
  },
  {
    title: "Disponibilidade",
    href: "/dashboard/availability",
    icon: CalendarClock,
  },
  {
    title: "Pagamentos",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Assinatura",
    href: "/dashboard/subscription/plans",
    icon: Subscription,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState(3) // Exemplo de notificações

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigation = (href: string) => {
    setIsLoading(true)
    router.push(href)
    setIsOpen(false)
    // Simular tempo de carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const isAdmin = user?.email === "admin@example.com" // Exemplo de verificação de admin

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <LoadingModal isOpen={isLoading} message="Carregando..." />

      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex h-full flex-col justify-between">
                  <div className="px-2 py-6">
                    <div className="flex items-center gap-2 px-4 py-2 mb-6">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CalendarClock className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-lg font-bold">AgendaFlex</span>
                    </div>
                    <nav className="mt-2 flex flex-col gap-1 px-2">
                      {navItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            pathname === item.href
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              className={cn("ml-auto text-xs", item.badgeColor || "bg-primary")}
                              variant="secondary"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div className="border-t p-4">
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
                      <LogOut className="h-5 w-5" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/dashboard")}>
              <div className="bg-primary/10 p-1.5 rounded-md hidden md:flex">
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold hidden md:inline-block">AgendaFlex</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-8 bg-muted/30 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" onClick={() => console.log("Notificações")}>
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notificações</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex"
                      onClick={() => handleNavigation("/admin")}
                    >
                      <BarChart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Painel Admin</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Usuário"} />
                    <AvatarFallback className="text-xs">{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user?.displayName?.split(" ")[0] || "Usuário"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard/profile")}>Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard/settings")}>
                  Configurações
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation("/admin")}>
                      <BarChart className="mr-2 h-4 w-4" />
                      Painel Admin
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-white dark:bg-gray-950 md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-6">
              <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors my-0.5",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge className={cn("ml-auto text-xs", item.badgeColor || "bg-primary")} variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                    {pathname === item.href && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Precisa de ajuda?</h4>
                <p className="mb-3 text-xs text-muted-foreground">
                  Acesse nossa central de suporte para tirar suas dúvidas.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open("https://suporte.agendaflex.com", "_blank")}
                >
                  Central de Suporte
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-5xl">
            <SubscriptionBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
