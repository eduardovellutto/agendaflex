"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  type Auth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth"
import { type Firestore, getFirestore } from "firebase/firestore"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Variáveis para armazenar as instâncias
let firebaseApp: FirebaseApp | undefined = undefined
let firebaseAuth: Auth | undefined = undefined
let firebaseDb: Firestore | undefined = undefined
let firebaseGoogleProvider: GoogleAuthProvider | undefined = undefined

// Inicializar Firebase App
function getFirebaseApp() {
  if (typeof window === "undefined") {
    return undefined
  }

  if (!firebaseApp) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig)
      } else {
        firebaseApp = getApps()[0]
      }
    } catch (error) {
      console.error("Erro ao inicializar Firebase App:", error)
    }
  }

  return firebaseApp
}

// Inicializar Auth
function getFirebaseAuth() {
  if (typeof window === "undefined") {
    return undefined
  }

  if (!firebaseAuth) {
    const app = getFirebaseApp()
    if (app) {
      try {
        firebaseAuth = getAuth(app)
      } catch (error) {
        console.error("Erro ao inicializar Firebase Auth:", error)
      }
    }
  }

  return firebaseAuth
}

// Inicializar Firestore
function getFirebaseDb() {
  if (typeof window === "undefined") {
    return undefined
  }

  if (!firebaseDb) {
    const app = getFirebaseApp()
    if (app) {
      try {
        firebaseDb = getFirestore(app)
      } catch (error) {
        console.error("Erro ao inicializar Firebase Firestore:", error)
      }
    }
  }

  return firebaseDb
}

// Inicializar Google Provider
function getGoogleProvider() {
  if (typeof window === "undefined") {
    return undefined
  }

  if (!firebaseGoogleProvider) {
    try {
      firebaseGoogleProvider = new GoogleAuthProvider()
    } catch (error) {
      console.error("Erro ao inicializar Google Provider:", error)
    }
  }

  return firebaseGoogleProvider
}

// Funções de autenticação com verificações de segurança
export async function signIn(email: string, password: string) {
  const authInstance = getFirebaseAuth()
  if (!authInstance) throw new Error("Auth não está inicializado")
  return signInWithEmailAndPassword(authInstance, email, password)
}

export async function signUp(email: string, password: string) {
  const authInstance = getFirebaseAuth()
  if (!authInstance) throw new Error("Auth não está inicializado")
  return createUserWithEmailAndPassword(authInstance, email, password)
}

export async function signInWithGoogle() {
  const authInstance = getFirebaseAuth()
  const provider = getGoogleProvider()
  if (!authInstance || !provider) throw new Error("Auth ou GoogleProvider não está inicializado")
  return signInWithPopup(authInstance, provider)
}

export async function signOut() {
  const authInstance = getFirebaseAuth()
  if (!authInstance) throw new Error("Auth não está inicializado")
  return firebaseSignOut(authInstance)
}

export async function resetPassword(email: string) {
  const authInstance = getFirebaseAuth()
  if (!authInstance) throw new Error("Auth não está inicializado")
  return sendPasswordResetEmail(authInstance, email)
}

// Função para observar mudanças no estado de autenticação
export function onAuthChanged(callback: (user: User | null) => void) {
  const authInstance = getFirebaseAuth()
  if (!authInstance) {
    console.error("Auth não está inicializado")
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(authInstance, callback)
}

// Exportar getters para as instâncias
export const getApp = getFirebaseApp
export const auth = getFirebaseAuth
export const getDb = getFirebaseDb
export const getGoogleAuthProvider = getGoogleProvider
