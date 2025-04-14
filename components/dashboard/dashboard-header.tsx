"use client"
import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}

// export function DashboardHeader() {
//   const { user, signOut } = useAuth()
//   const router = useRouter()

//   const handleSignOut = async () => {
//     await signOut()
//     router.push("/")
//   }

//   return (
//     <header className="sticky top-0 z-40 border-b bg-background">
//       <div className="container flex h-14 items-center justify-between">
//         <div className="flex items-center gap-2 md:gap-4">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//                 <span className="sr-only">Toggle menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-[240px] sm:w-[280px]">
//               <Link href="/dashboard" className="flex items-center gap-2 pb-4 pt-2">
//                 <CalendarClock className="h-5 w-5 text-primary" />
//                 <span className="font-bold">AgendaFlex</span>
//               </Link>
//               <DashboardNav />
//             </SheetContent>
//           </Sheet>
//           <Link href="/dashboard" className="flex items-center gap-2">
//             <CalendarClock className="h-5 w-5 text-primary" />
//             <span className="hidden font-bold md:inline-block">AgendaFlex</span>
//           </Link>
//         </div>
//         <div className="flex items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <User className="h-5 w-5" />
//                 <span className="sr-only">Perfil</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/profile">Perfil</Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard/settings">Configurações</Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }
