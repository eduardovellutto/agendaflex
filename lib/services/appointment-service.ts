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
  Timestamp,
  limit,
} from "firebase/firestore"
import { getDb } from "../firebase"
import type { Appointment, AppointmentWithClient, Client, Service } from "../types"
import { getClient } from "./client-service"
import { getService } from "./service-service"

const APPOINTMENTS_COLLECTION = "appointments"

export async function createAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION)
  const docRef = await addDoc(appointmentsRef, {
    ...appointment,
    date: appointment.date instanceof Date ? Timestamp.fromDate(appointment.date) : appointment.date,
  })

  return {
    id: docRef.id,
    ...appointment,
  } as Appointment
}

export async function getAppointment(appointmentId: string): Promise<Appointment | null> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId)
  const appointmentSnap = await getDoc(appointmentRef)

  if (appointmentSnap.exists()) {
    return { id: appointmentSnap.id, ...appointmentSnap.data() } as Appointment
  }

  return null
}

export async function getAppointmentWithDetails(appointmentId: string): Promise<AppointmentWithClient | null> {
  const appointment = await getAppointment(appointmentId)

  if (!appointment) return null

  const client = await getClient(appointment.clientId)
  const service = await getService(appointment.serviceId)

  if (!client || !service) return null

  return {
    ...appointment,
    client,
    service,
  }
}

export async function getAppointmentsByUser(userId: string): Promise<Appointment[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION)
  const q = query(appointmentsRef, where("userId", "==", userId), orderBy("date", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[]
}

export async function getAppointmentsByProfessional(professionalId: string): Promise<Appointment[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION)
  const q = query(appointmentsRef, where("professionalId", "==", professionalId), orderBy("date", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[]
}

export async function getAppointmentsByDate(userId: string, date: Date): Promise<AppointmentWithClient[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION)
  const q = query(
    appointmentsRef,
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(startOfDay)),
    where("date", "<=", Timestamp.fromDate(endOfDay)),
    orderBy("date", "asc"),
  )

  const querySnapshot = await getDocs(q)
  const appointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[]

  // Fetch client and service details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const client = await getClient(appointment.clientId)
      const service = await getService(appointment.serviceId)

      return {
        ...appointment,
        client: client as Client,
        service: service as Service,
      }
    }),
  )

  return appointmentsWithDetails
}

export async function getUpcomingAppointments(userId: string, count = 5): Promise<AppointmentWithClient[]> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const now = new Date()

  const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION)
  const q = query(
    appointmentsRef,
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(now)),
    where("status", "in", ["scheduled", "confirmed"]),
    orderBy("date", "asc"),
    limit(count),
  )

  const querySnapshot = await getDocs(q)
  const appointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[]

  // Fetch client and service details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const client = await getClient(appointment.clientId)
      const service = await getService(appointment.serviceId)

      return {
        ...appointment,
        client: client as Client,
        service: service as Service,
      }
    }),
  )

  return appointmentsWithDetails
}

export async function getAppointmentStats(
  userId: string,
): Promise<{ total: number; completed: number; upcoming: number }> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const now = new Date()

  // Get total appointments
  const totalQuery = query(collection(db, APPOINTMENTS_COLLECTION), where("userId", "==", userId))
  const totalSnapshot = await getDocs(totalQuery)
  const total = totalSnapshot.size

  // Get completed appointments
  const completedQuery = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where("userId", "==", userId),
    where("status", "==", "completed"),
  )
  const completedSnapshot = await getDocs(completedQuery)
  const completed = completedSnapshot.size

  // Get upcoming appointments
  const upcomingQuery = query(
    collection(db, APPOINTMENTS_COLLECTION),
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(now)),
    where("status", "in", ["scheduled", "confirmed"]),
  )
  const upcomingSnapshot = await getDocs(upcomingQuery)
  const upcoming = upcomingSnapshot.size

  return { total, completed, upcoming }
}

export async function updateAppointment(appointmentId: string, data: Partial<Appointment>): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId)

  // Convert Date to Timestamp if present
  if (data.date && data.date instanceof Date) {
    data.date = Timestamp.fromDate(data.date)
  }

  await updateDoc(appointmentRef, data)
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error("Firestore não está inicializado")

  const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId)
  await deleteDoc(appointmentRef)
}
