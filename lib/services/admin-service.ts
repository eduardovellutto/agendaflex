"\"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { getDb } from "../firebase"
import type { AdminStats, AdminUser, SubscriptionWithUser, UserActivity } from "../types/admin"
import type { SubscriptionPlan, UserSubscription } from "../types/subscription"
import type { User } from "../types/user"

const USERS_COLLECTION = "users"
const USER_SUBSCRIPTIONS_COLLECTION = "user_subscriptions"
const PLANS_COLLECTION = "subscription_plans"
const USER_ACTIVITY_COLLECTION = "user_activity"

// Verificar se o usuário atual é um administrador
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as AdminUser
      return userData.role === "admin"
    }

    return false
  } catch (error) {
    console.error("Erro ao verificar permissões de administrador:", error)
    return false
  }
}

// Obter estatísticas para o dashboard de administração
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    // Obter todos os usuários
    const usersRef = collection(db, USERS_COLLECTION)
    const usersSnapshot = await getDocs(usersRef)
    const totalUsers = usersSnapshot.size

    // Obter assinaturas ativas
    const subscriptionsRef = collection(db, USER_SUBSCRIPTIONS_COLLECTION)
    const activeQuery = query(subscriptionsRef, where("status", "==", "active"))
    const activeSnapshot = await getDocs(activeQuery)
    const activeSubscriptions = activeSnapshot.size

    // Obter assinaturas em trial
    const trialQuery = query(subscriptionsRef, where("status", "==", "trial"))
    const trialSnapshot = await getDocs(trialQuery)
    const trialSubscriptions = trialSnapshot.size

    // Obter assinaturas expiradas
    const expiredQuery = query(subscriptionsRef, where("status", "in", ["expired", "canceled"]))
    const expiredSnapshot = await getDocs(expiredQuery)
    const expiredSubscriptions = expiredSnapshot.size

    // Calcular receita (simulado por enquanto)
    const revenueThisMonth = activeSubscriptions * 50 // Valor médio de assinatura
    const revenueLastMonth = revenueThisMonth * 0.9 // Simulação de crescimento

    // Calcular crescimento de usuários (simulado)
    const userGrowth = 10 // 10% de crescimento

    return {
      totalUsers,
      activeSubscriptions,
      trialSubscriptions,
      expiredSubscriptions,
      revenueThisMonth,
      revenueLastMonth,
      userGrowth,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas de administração:", error)
    throw error
  }
}

// Obter todos os usuários com paginação
export async function getAllUsers(page = 1, pageSize = 10): Promise<AdminUser[]> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(page * pageSize))
    const snapshot = await getDocs(q)

    const users = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          lastLogin: data.lastLogin?.toDate(),
        } as AdminUser
      })
      .slice((page - 1) * pageSize, page * pageSize)

    return users
  } catch (error) {
    console.error("Erro ao obter usuários:", error)
    throw error
  }
}

// Obter todas as assinaturas com informações do usuário
export async function getAllSubscriptions(page = 1, pageSize = 10): Promise<SubscriptionWithUser[]> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const subscriptionsRef = collection(db, USER_SUBSCRIPTIONS_COLLECTION)
    const q = query(subscriptionsRef, orderBy("createdAt", "desc"), limit(page * pageSize))
    const snapshot = await getDocs(q)

    const subscriptionsPromises = snapshot.docs.slice((page - 1) * pageSize, page * pageSize).map(async (doc) => {
      const data = doc.data() as UserSubscription
      const userRef = doc(db, USERS_COLLECTION, data.userId)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.exists() ? (userSnap.data() as User) : null

      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        trialEndsAt: data.trialEndsAt?.toDate(),
        canceledAt: data.canceledAt?.toDate(),
        user: userData
          ? {
              id: userData.id,
              email: userData.email,
              displayName: userData.displayName,
            }
          : { id: data.userId, email: "Usuário não encontrado" },
      } as SubscriptionWithUser
    })

    return await Promise.all(subscriptionsPromises)
  } catch (error) {
    console.error("Erro ao obter assinaturas:", error)
    throw error
  }
}

// Atualizar um plano de assinatura
export async function updateSubscriptionPlan(planId: string, planData: Partial<SubscriptionPlan>): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const planRef = doc(db, PLANS_COLLECTION, planId)
    await updateDoc(planRef, {
      ...planData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erro ao atualizar plano de assinatura:", error)
    throw error
  }
}

// Criar um novo plano de assinatura
export async function createSubscriptionPlan(planData: Omit<SubscriptionPlan, "id">): Promise<string> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const plansRef = collection(db, PLANS_COLLECTION)
    const docRef = await addDoc(plansRef, {
      ...planData,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Erro ao criar plano de assinatura:", error)
    throw error
  }
}

// Obter todos os planos disponíveis
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const plansRef = collection(db, PLANS_COLLECTION)
    const querySnapshot = await getDocs(plansRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SubscriptionPlan[]
  } catch (error) {
    console.error("Erro ao obter planos de assinatura:", error)
    throw error
  }
}

// Atualizar a assinatura de um usuário
export async function updateUserSubscription(
  subscriptionId: string,
  subscriptionData: Partial<UserSubscription>,
): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const subscriptionRef = doc(db, USER_SUBSCRIPTIONS_COLLECTION, subscriptionId)
    await updateDoc(subscriptionRef, {
      ...subscriptionData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erro ao atualizar assinatura de usuário:", error)
    throw error
  }
}

// Registrar atividade do usuário
export async function logUserActivity(userId: string, action: string, details?: string): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const activityRef = collection(db, USER_ACTIVITY_COLLECTION)
    await addDoc(activityRef, {
      userId,
      action,
      details,
      timestamp: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erro ao registrar atividade do usuário:", error)
    // Não lançamos o erro para não interromper o fluxo principal
  }
}

// Obter atividades recentes de um usuário
export async function getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const activityRef = collection(db, USER_ACTIVITY_COLLECTION)
    const q = query(activityRef, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(limit))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate(),
      } as UserActivity
    })
  } catch (error) {
    console.error("Erro ao obter atividades do usuário:", error)
    throw error
  }
}

// Promover um usuário a administrador
export async function promoteToAdmin(userId: string): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(userRef, {
      role: "admin",
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erro ao promover usuário a administrador:", error)
    throw error
  }
}

// Remover privilégios de administrador
export async function demoteFromAdmin(userId: string): Promise<void> {
  try {
    const db = getDb()
    if (!db) throw new Error("Firestore não está inicializado")

    const userRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(userRef, {
      role: "user",
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erro ao remover privilégios de administrador:", error)
    throw error
  }
}
