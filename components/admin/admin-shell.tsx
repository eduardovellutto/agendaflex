"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Bell,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  ChevronDown,
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
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
    badge: "Novo",
    badgeColor: "bg-green-500",
  },
  {
    title: "Assinaturas",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Planos",
    href: "/admin/plans",
    icon: Package,
  },
  {
    title: "Notificações",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "A"
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
    }, 300)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
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
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-lg font-bold">Admin Panel</span>
                    </div>
                    <nav className="mt-2 flex flex-col gap-1 px-2">
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-start gap-2 mb-2"
                        onClick={() => handleNavigation("/dashboard")}
                      >
                        <Home className="h-5 w-5" />
                        Voltar ao Dashboard
                      </Button>
                      <div className="my-2 h-px bg-border" />
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/admin")}>
              <div className="bg-primary/10 p-1.5 rounded-md hidden md:flex">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold hidden md:inline-block">Admin Panel</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuários, assinaturas..."
                className="w-full pl-8 bg-muted/30 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigation("/dashboard")}
                    className="hidden md:flex"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voltar ao Dashboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Admin"} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user?.displayName || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">Admin</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Administrador</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
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
                <h4 className="mb-2 text-sm font-medium">Modo Administrador</h4>
                <p className="mb-3 text-xs text-muted-foreground">
                  Você está no painel de administração com acesso a todas as funcionalidades.
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleNavigation("/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
