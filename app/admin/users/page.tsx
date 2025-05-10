"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Shield, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getAllUsers, promoteToAdmin, demoteFromAdmin } from "@/lib/services/admin-service"
import type { AdminUser } from "@/lib/types/admin"
import { useToast } from "@/components/ui/use-toast"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersData = await getAllUsers(currentPage, 10)
        setUsers(usersData)
        setFilteredUsers(usersData)
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [currentPage, toast])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await promoteToAdmin(userId)
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a administrador com sucesso.",
      })

      // Atualizar a lista de usuários
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, role: "admin" }
        }
        return user
      })

      setUsers(updatedUsers)
      setFilteredUsers(
        filteredUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, role: "admin" }
          }
          return user
        }),
      )
    } catch (error) {
      console.error("Erro ao promover usuário:", error)
      toast({
        variant: "destructive",
        title: "Erro ao promover usuário",
        description: "Não foi possível promover o usuário a administrador.",
      })
    }
  }

  const handleDemoteFromAdmin = async (userId: string) => {
    try {
      await demoteFromAdmin(userId)
      toast({
        title: "Privilégios removidos",
        description: "Os privilégios de administrador foram removidos com sucesso.",
      })

      // Atualizar a lista de usuários
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, role: "user" }
        }
        return user
      })

      setUsers(updatedUsers)
      setFilteredUsers(
        filteredUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, role: "user" }
          }
          return user
        }),
      )
    } catch (error) {
      console.error("Erro ao remover privilégios:", error)
      toast({
        variant: "destructive",
        title: "Erro ao remover privilégios",
        description: "Não foi possível remover os privilégios de administrador.",
      })
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma e suas permissões.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Lista de todos os usuários registrados na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Último login</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.displayName || "Sem nome"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.role === "admin" ? (
                              <>
                                <Shield className="mr-1 h-4 w-4 text-primary" />
                                <span>Admin</span>
                              </>
                            ) : (
                              <span>Usuário</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.role === "admin" ? (
                                <DropdownMenuItem onClick={() => handleDemoteFromAdmin(user.id)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  Remover admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Tornar admin
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={filteredUsers.length < 10}
          >
            Próxima
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
