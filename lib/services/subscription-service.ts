"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { getDb } from "../firebase"
import type { SubscriptionPlan, UserSubscription, SubscriptionPlanType } from "../types/subscription"

const PLANS_COLLECTION = "subscription_plans"
const USER_SUBSCRIPTIONS_COLLECTION = "user_subscriptions"

// Obter todos os planos disponíveis
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const plansRef = collection(db, PLANS_COLLECTION)
  const querySnapshot = await getDocs(plansRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SubscriptionPlan[]
}

// Obter um plano específico
export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const planRef = doc(db, PLANS_COLLECTION, planId)
  const planSnap = await getDoc(planRef)

  if (planSnap.exists()) {
    return { id: planSnap.id, ...planSnap.data() } as SubscriptionPlan
  }

  return null
}

// Obter a assinatura atual do usuário
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const subscriptionsRef = collection(db, USER_SUBSCRIPTIONS_COLLECTION)
  const q = query(subscriptionsRef, where("userId", "==", userId), where("status", "in", ["active", "trial"]))

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  const subscriptionDoc = querySnapshot.docs[0]
  const data = subscriptionDoc.data()

  return {
    id: subscriptionDoc.id,
    ...data,
    startDate: data.startDate?.toDate(),
    endDate: data.endDate?.toDate(),
    trialEndsAt: data.trialEndsAt?.toDate(),
    canceledAt: data.canceledAt?.toDate(),
  } as UserSubscription
}

// Criar uma nova assinatura para o usuário
export async function createUserSubscription(
  userId: string,
  planType: SubscriptionPlanType,
  planId: string,
): Promise<UserSubscription> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  // Verificar se o usuário já tem uma assinatura ativa
  const existingSubscription = await getUserSubscription(userId)
  if (existingSubscription) {
    throw new Error("Usuário já possui uma assinatura ativa")
  }

  const now = new Date()
  let endDate = new Date()
  let trialEndsAt: Date | undefined

  if (planType === "trial") {
    // Trial de 15 dias
    trialEndsAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
    endDate = trialEndsAt
  } else {
    // Assinatura regular de 30 dias
    endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  }

  const subscriptionData = {
    userId,
    planId,
    planType,
    status: planType === "trial" ? "trial" : "active",
    startDate: Timestamp.fromDate(now),
    endDate: Timestamp.fromDate(endDate),
    trialEndsAt: trialEndsAt ? Timestamp.fromDate(trialEndsAt) : null,
    createdAt: serverTimestamp(),
  }

  const subscriptionsRef = collection(db, USER_SUBSCRIPTIONS_COLLECTION)
  const docRef = await addDoc(subscriptionsRef, subscriptionData)

  return {
    id: docRef.id,
    ...subscriptionData,
    startDate: now,
    endDate,
    trialEndsAt,
  } as UserSubscription
}

// Cancelar uma assinatura
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const subscriptionRef = doc(db, USER_SUBSCRIPTIONS_COLLECTION, subscriptionId)
  await updateDoc(subscriptionRef, {
    status: "canceled",
    canceledAt: Timestamp.fromDate(new Date()),
  })
}

// Atualizar o plano de assinatura
export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPlanId: string,
  newPlanType: SubscriptionPlanType,
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const subscriptionRef = doc(db, USER_SUBSCRIPTIONS_COLLECTION, subscriptionId)

  // Estender a data de término por mais 30 dias a partir de hoje
  const now = new Date()
  const newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await updateDoc(subscriptionRef, {
    planId: newPlanId,
    planType: newPlanType,
    status: "active", // Garantir que o status seja ativo
    endDate: Timestamp.fromDate(newEndDate),
    updatedAt: serverTimestamp(),
  })
}

// Verificar se o usuário está dentro dos limites do plano
export async function checkSubscriptionLimits(
  userId: string,
  resourceType: "clients" | "services" | "appointments",
  currentCount: number,
): Promise<{ withinLimits: boolean; limit: number }> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return { withinLimits: false, limit: 0 }
  }

  const plan = await getSubscriptionPlan(subscription.planId)

  if (!plan) {
    return { withinLimits: false, limit: 0 }
  }

  const limit = plan.limits[resourceType]
  const withinLimits = currentCount < limit

  return { withinLimits, limit }
}

// Verificar se uma funcionalidade está disponível no plano do usuário
export async function isFeatureAvailable(userId: string, featureKey: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return false
  }

  // Se for trial, todas as funcionalidades estão disponíveis
  if (subscription.status === "trial") {
    return true
  }

  // Definir quais recursos estão disponíveis em cada plano
  const planFeatures: Record<SubscriptionPlanType, string[]> = {
    trial: ["basic_scheduling", "client_management", "service_management", "availability_management", "basic_reports"],
    essential: [
      "basic_scheduling",
      "client_management",
      "service_management",
      "availability_management",
      "basic_reports",
      "email_notifications",
    ],
    professional: [
      "basic_scheduling",
      "client_management",
      "service_management",
      "availability_management",
      "advanced_reports",
      "email_notifications",
      "sms_notifications",
      "whatsapp_notifications",
      "online_payments",
      "custom_branding",
      "api_access",
    ],
  }

  return planFeatures[subscription.planType].includes(featureKey)
}
