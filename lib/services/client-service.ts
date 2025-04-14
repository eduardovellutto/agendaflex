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
import type { Client } from "../types"

const CLIENTS_COLLECTION = "clients"

export async function createClient(client: Omit<Client, "id">): Promise<Client> {
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
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  const clientSnap = await getDoc(clientRef)

  if (clientSnap.exists()) {
    return { id: clientSnap.id, ...clientSnap.data() } as Client
  }

  return null
}

export async function getClientsByUser(userId: string): Promise<Client[]> {
  const clientsRef = collection(db, CLIENTS_COLLECTION)
  const q = query(clientsRef, where("userId", "==", userId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[]
}

// Função que estava faltando
export async function getClientsByProfessional(professionalId: string): Promise<Client[]> {
  const clientsRef = collection(db, CLIENTS_COLLECTION)
  const q = query(clientsRef, where("professionalId", "==", professionalId), orderBy("name", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Client[]
}

export async function updateClient(clientId: string, data: Partial<Client>): Promise<void> {
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  await updateDoc(clientRef, data)
}

export async function deleteClient(clientId: string): Promise<void> {
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId)
  await deleteDoc(clientRef)
}
