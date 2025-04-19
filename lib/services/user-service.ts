"use client"

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { getDb } from "../firebase"
import type { User } from "../types"

const USERS_COLLECTION = "users"

// Função para criar um usuário
export async function createUser(user: User): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, user.id)
    await setDoc(userRef, {
      ...user,
      createdAt: new Date(),
    })
    console.log("Perfil de usuário criado com sucesso:", user.id)
  } catch (error) {
    console.error("Erro ao criar perfil de usuário:", error)
    throw error
  }
}

// Função para obter um usuário pelo ID
export async function getUser(userId: string): Promise<User | null> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User
    }

    return null
  } catch (error) {
    console.error("Erro ao obter usuário:", error)
    return null
  }
}

// Alias para getUser para manter compatibilidade
export async function getUserById(userId: string): Promise<User | null> {
  return getUser(userId)
}

// Função para atualizar um usuário
export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(userRef, data)
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    throw error
  }
}
