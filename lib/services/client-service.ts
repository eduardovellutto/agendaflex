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
import type { Client } from "../types"

const CLIENTS_COLLECTION = "clients"

export async function createClient(client: Omit<Client, "id">): Promise<Client> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientsRef = collection(db, CLIENTS_COLLECTION)
  const docRef = await addDoc(clientsRef, {
    ...client,
    createdAt: new Date(),
  })

  return {
    id: docRef.id,
    ...client,
  } as Client
}

export async function getClient(clientId: string): Promise<Client | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  const clientSnap = await getDoc(clientRef)

  if (clientSnap.exists()) {
    return { id: clientSnap.id, ...clientSnap.data() } as Client
  }

  return null
}

export async function getClientsByUser(userId: string): Promise<Client[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientsRef = collection(db, CLIENTS_COLLECTION)
  const q = query(clientsRef, where("userId", "==", userId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[]
}

export async function getClientsByProfessional(professionalId: string): Promise<Client[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientsRef = collection(db, CLIENTS_COLLECTION)
  const q = query(clientsRef, where("professionalId", "==", professionalId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[]
}

export async function updateClient(clientId: string, data: Partial<Client>): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  await updateDoc(clientRef, data)
}

export async function deleteClient(clientId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  await deleteDoc(clientRef)
}
