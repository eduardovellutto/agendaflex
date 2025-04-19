"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { onAuthChanged, signIn, signUp, signInWithGoogle, signOut, resetPassword } from "./firebase"
import type { User } from "firebase/auth"

// Tipo do contexto de autenticação
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Garantir que estamos no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Configurar listener de autenticação
  useEffect(() => {
    if (!mounted) return

    const unsubscribe = onAuthChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [mounted])

  // Não renderizar nada no servidor
  if (!mounted) {
    return null
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
