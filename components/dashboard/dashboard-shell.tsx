"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CalendarClock, CalendarDays, Clock, CreditCard, Home, LogOut, Menu, Settings, Users } from "lucide-react"
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

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
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

  return (
    <div className="flex min-h-screen flex-col">
      <LoadingModal isOpen={isLoading} message="Carregando..." />

      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="flex h-full flex-col justify-between">
                  <div className="px-2 py-6">
                    <div className="flex items-center gap-2 px-2">
                      <CalendarClock className="h-6 w-6 text-primary" />
                      <span className="text-lg font-bold">AgendaFlex</span>
                    </div>
                    <nav className="mt-8 flex flex-col gap-2">
                      {navItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href && "bg-accent text-accent-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
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
              <CalendarClock className="h-6 w-6 text-primary" />
              <span className="hidden text-lg font-bold md:inline-block">AgendaFlex</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Usuário"} />
                    <AvatarFallback>{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button onClick={() => handleNavigation("/dashboard/profile")}>Perfil</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button onClick={() => handleNavigation("/dashboard/settings")}>Configurações</button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-8">
              <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
