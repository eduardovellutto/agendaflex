import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCFk-eYSNlPdjlLIjJL26FR7PJ6GAfQ__Q",
  authDomain: "agendaflex-8fxmb.firebaseapp.com",
  projectId: "agendaflex-8fxmb",
  storageBucket: "agendaflex-8fxmb.appspot.com", // Corrigido o storageBucket
  messagingSenderId: "223344630788",
  appId: "1:223344630788:web:ec0ec87bd0fbe3fa0a6951",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Conectar aos emuladores em ambiente de desenvolvimento (opcional)
if (process.env.NODE_ENV === "development") {
  try {
    // Descomente estas linhas se estiver usando emuladores locais
    // connectAuthEmulator(auth, 'http://localhost:9099')
    // connectFirestoreEmulator(db, 'localhost', 8080)
    // connectStorageEmulator(storage, 'localhost', 9199)
  } catch (error) {
    console.error("Erro ao conectar aos emuladores:", error)
  }
}

export { app, auth, db, storage }
