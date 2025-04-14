import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase-config"
import type { User } from "../types"

const USERS_COLLECTION = "users"

// Melhorar o tratamento de erros na função createUser
export async function createUser(user: User): Promise<void> {
  try {
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

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, USERS_COLLECTION, userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User
  }

  return null
}

// Função que estava faltando - Alias para getUser para manter compatibilidade
export async function getUserById(userId: string): Promise<User | null> {
  return getUser(userId)
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, data)
}
