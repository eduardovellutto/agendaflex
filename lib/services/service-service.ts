"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { getDb } from "../firebase"
import type { Service } from "../types"
import { checkSubscriptionLimits } from "./subscription-service"

const SERVICES_COLLECTION = "services"

export async function createService(service: Omit<Service, "id">): Promise<Service> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  // Verificar limites da assinatura
  const { withinLimits, limit } = await checkSubscriptionLimits(
    service.professionalId,
    "services",
    // Obter contagem atual de serviços
    (await getServicesByProfessional(service.professionalId)).length,
  )

  if (!withinLimits) {
    throw new Error(`Limite de serviços atingido (${limit}). Faça upgrade do seu plano para adicionar mais serviços.`)
  }

  const servicesRef = collection(db, SERVICES_COLLECTION)
  const docRef = await addDoc(servicesRef, service)

  return {
    id: docRef.id,
    ...service,
  } as Service
}

export async function getService(serviceId: string): Promise<Service | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  const serviceSnap = await getDoc(serviceRef)

  if (serviceSnap.exists()) {
    return { id: serviceSnap.id, ...serviceSnap.data() } as Service
  }

  return null
}

export async function getServicesByUser(userId: string): Promise<Service[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const servicesRef = collection(db, SERVICES_COLLECTION)
  const q = query(servicesRef, where("userId", "==", userId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[]
}

export async function getServicesByProfessional(professionalId: string): Promise<Service[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const servicesRef = collection(db, SERVICES_COLLECTION)
  const q = query(servicesRef, where("professionalId", "==", professionalId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[]
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  await updateDoc(serviceRef, data)
}

export async function deleteService(serviceId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  await deleteDoc(serviceRef)
}
