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
import { db } from "../firebase/firebase-config"
import type { Service } from "../types"

const SERVICES_COLLECTION = "services"

export async function createService(service: Omit<Service, "id">): Promise<Service> {
  const servicesRef = collection(db, SERVICES_COLLECTION)
  const docRef = await addDoc(servicesRef, service)

  return {
    id: docRef.id,
    ...service,
  } as Service
}

export async function getService(serviceId: string): Promise<Service | null> {
  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  const serviceSnap = await getDoc(serviceRef)

  if (serviceSnap.exists()) {
    return { id: serviceSnap.id, ...serviceSnap.data() } as Service
  }

  return null
}

export async function getServicesByUser(userId: string): Promise<Service[]> {
  const servicesRef = collection(db, SERVICES_COLLECTION)
  const q = query(servicesRef, where("userId", "==", userId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[]
}

// Função que estava faltando
export async function getServicesByProfessional(professionalId: string): Promise<Service[]> {
  const servicesRef = collection(db, SERVICES_COLLECTION)
  const q = query(servicesRef, where("professionalId", "==", professionalId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[]
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<void> {
  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  await updateDoc(serviceRef, data)
}

export async function deleteService(serviceId: string): Promise<void> {
  const serviceRef = doc(db, SERVICES_COLLECTION, serviceId)
  await deleteDoc(serviceRef)
}
