// Este script deve ser executado para inicializar os planos de assinatura no Firestore
// Pode ser executado com: node scripts/init-subscription-plans.js

const { initializeApp } = require("firebase/app")
const { getFirestore, collection, addDoc, getDocs, query, where } = require("firebase/firestore")

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Inicializar o Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Planos de assinatura
const subscriptionPlans = [
  {
    name: "Trial",
    description: "Experimente gratuitamente por 15 dias",
    price: 0,
    features: [
      "Até 5 clientes",
      "Até 3 serviços",
      "Até 10 agendamentos",
      "Gerenciamento de disponibilidade",
      "Relatórios básicos",
    ],
    limits: {
      clients: 5,
      services: 3,
      appointments: 10,
    },
  },
  {
    name: "Essencial",
    description: "Para profissionais iniciantes",
    price: 49.9,
    features: [
      "Até 50 clientes",
      "Até 10 serviços",
      "Agendamentos ilimitados",
      "Notificações por email",
      "Relatórios básicos",
    ],
    limits: {
      clients: 50,
      services: 10,
      appointments: 0, // 0 significa ilimitado
    },
  },
  {
    name: "Profissional",
    description: "Para profissionais estabelecidos",
    price: 99.9,
    features: [
      "Clientes ilimitados",
      "Serviços ilimitados",
      "Agendamentos ilimitados",
      "Notificações por email, SMS e WhatsApp",
      "Relatórios avançados",
      "Pagamentos online",
      "Personalização de marca",
    ],
    limits: {
      clients: 0, // 0 significa ilimitado
      services: 0, // 0 significa ilimitado
      appointments: 0, // 0 significa ilimitado
    },
  },
]

// Função para verificar se os planos já existem
async function checkPlansExist() {
  const plansRef = collection(db, "subscription_plans")
  const q = query(plansRef, where("name", "==", "Trial"))
  const snapshot = await getDocs(q)

  return !snapshot.empty
}

// Função para adicionar os planos ao Firestore
async function addPlans() {
  try {
    const plansExist = await checkPlansExist()

    if (plansExist) {
      console.log("Os planos já existem no Firestore. Pulando a inicialização.")
      return
    }

    const plansRef = collection(db, "subscription_plans")

    for (const plan of subscriptionPlans) {
      await addDoc(plansRef, {
        ...plan,
        createdAt: new Date(),
      })
      console.log(`Plano "${plan.name}" adicionado com sucesso.`)
    }

    console.log("Todos os planos foram adicionados com sucesso!")
  } catch (error) {
    console.error("Erro ao adicionar planos:", error)
  }
}

// Executar a função
addPlans()
