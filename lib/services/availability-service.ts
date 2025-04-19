"use client"

import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { getDb } from "../firebase"
import type { Availability } from "../types"

const AVAILABILITY_COLLECTION = "availability"

export async function createAvailability(availability: Omit<Availability, "id">): Promise<Availability> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = collection(db, AVAILABILITY_COLLECTION)
  const docRef = await addDoc(availabilityRef, availability)

  return {
    id: docRef.id,
    ...availability,
  } as Availability
}

export async function getAvailabilityByUser(userId: string): Promise<Availability[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = collection(db, AVAILABILITY_COLLECTION)
  const q = query(availabilityRef, where("userId", "==", userId), orderBy("dayOfWeek", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Availability[]
}

export async function getAvailabilityByProfessional(professionalId: string): Promise<Availability | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = collection(db, AVAILABILITY_COLLECTION)
  const q = query(availabilityRef, where("professionalId", "==", professionalId))

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  // Assumindo que cada profissional tem apenas um documento de disponibilidade
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Availability
}

export async function updateAvailability(availabilityId: string, data: Partial<Availability>): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = doc(db, AVAILABILITY_COLLECTION, availabilityId)
  await updateDoc(availabilityRef, data)
}

// Sobrecarga para atualizar pela ID do profissional
export async function updateAvailabilityByProfessionalId(availability: Availability): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = collection(db, AVAILABILITY_COLLECTION)
  const q = query(availabilityRef, where("professionalId", "==", availability.professionalId))

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    // Se não existir, cria um novo documento
    await createAvailability(availability)
  } else {
    // Se existir, atualiza o documento existente
    const docRef = doc(db, AVAILABILITY_COLLECTION, querySnapshot.docs[0].id)
    await updateDoc(docRef, { ...availability })
  }
}

export async function deleteAvailability(availabilityId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const availabilityRef = doc(db, AVAILABILITY_COLLECTION, availabilityId)
  await deleteDoc(availabilityRef)
}

// Helper function to set default availability for a new user
export async function setDefaultAvailability(userId: string): Promise<void> {
  // Default availability: Monday to Friday, 9 AM to 5 PM
  const defaultAvailability = [
    { dayOfWeek: 0, isAvailable: false, startTime: "09:00", endTime: "17:00" }, // Sunday
    { dayOfWeek: 1, isAvailable: true, startTime: "09:00", endTime: "17:00" }, // Monday
    { dayOfWeek: 2, isAvailable: true, startTime: "09:00", endTime: "17:00" }, // Tuesday
    { dayOfWeek: 3, isAvailable: true, startTime: "09:00", endTime: "17:00" }, // Wednesday
    { dayOfWeek: 4, isAvailable: true, startTime: "09:00", endTime: "17:00" }, // Thursday
    { dayOfWeek: 5, isAvailable: true, startTime: "09:00", endTime: "17:00" }, // Friday
    { dayOfWeek: 6, isAvailable: false, startTime: "09:00", endTime: "17:00" }, // Saturday
  ]

  for (const availability of defaultAvailability) {
    await createAvailability({
      userId,
      ...availability,
    })
  }
}
