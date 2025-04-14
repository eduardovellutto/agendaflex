"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, CreditCard, Home, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Agenda",
    href: "/dashboard/calendar",
    icon: Calendar,
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

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            "flex h-9 items-center justify-start gap-2 px-3 hover:bg-muted",
            pathname === item.href && "bg-muted font-medium",
          )}
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}
