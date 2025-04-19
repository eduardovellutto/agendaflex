"\"use client"

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

// Inicializar Firebase App
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let googleProvider: GoogleAuthProvider | undefined

// Função para inicializar o Firebase
function initializeFirebase() {
  if (typeof window !== "undefined") {
    try {
      if (!app) {
        if (getApps().length === 0) {
          app = initializeApp(firebaseConfig)
        } else {
          app = getApps()[0]
        }

        // Inicializar serviços
        auth = getAuth(app)
        db = getFirestore(app)
        googleProvider = new GoogleAuthProvider()

        console.log("Firebase inicializado com sucesso")
      }
    } catch (error) {
      console.error("Erro ao inicializar Firebase:", error)
    }
  }
}

// Inicializar Firebase imediatamente no lado do cliente
if (typeof window !== "undefined") {
  initializeFirebase()
}

// Funções de autenticação com verificações de segurança
export async function signIn(email: string, password: string) {
  if (!auth) {
    initializeFirebase()
    if (!auth) throw new Error("Auth não está inicializado")
  }

  try {
    console.log("Tentando fazer login com:", email)
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log("Login bem-sucedido:", result.user.uid)
    return result
  } catch (error) {
    console.error("Erro no login:", error)
    throw error
  }
}

export async function signUp(email: string, password: string) {
  if (!auth) {
    initializeFirebase()
    if (!auth) throw new Error("Auth não está inicializado")
  }

  return createUserWithEmailAndPassword(auth, email, password)
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    initializeFirebase()
    if (!auth || !googleProvider) throw new Error("Auth ou GoogleProvider não está inicializado")
  }

  return signInWithPopup(auth, googleProvider)
}

export async function signOut() {
  if (!auth) {
    initializeFirebase()
    if (!auth) throw new Error("Auth não está inicializado")
  }

  return firebaseSignOut(auth)
}

export async function resetPassword(email: string) {
  if (!auth) {
    initializeFirebase()
    if (!auth) throw new Error("Auth não está inicializado")
  }

  return sendPasswordResetEmail(auth, email)
}

// Função para observar mudanças no estado de autenticação
export function onAuthChanged(callback: (user: User | null) => void) {
  if (!auth) {
    initializeFirebase()
    if (!auth) {
      console.error("Auth não está inicializado")
      callback(null)
      return () => {}
    }
  }

  return onAuthStateChanged(auth, callback)
}

// Exportar instâncias
export { app, auth, db, googleProvider }

export function getDb() {
  if (!db) {
    initializeFirebase()
    return db
  }
  return db
}
