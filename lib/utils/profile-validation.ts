import type { User } from "@/lib/types"

// Campos obrigatórios para um perfil profissional completo
export function isProfileComplete(user: User | null): boolean {
  if (!user) return false

  // Verificar se os campos obrigatórios estão preenchidos
  return !!(user.name && user.profession && user.bio && user.phone)
}
