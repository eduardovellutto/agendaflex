// Este script deve ser executado uma vez para inicializar os planos de assinatura no Firestore
// Pode ser executado via Firebase Functions ou manualmente

const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function initSubscriptionPlans() {
  const plansCollection = db.collection("subscription_plans")

  // Verificar se já existem planos
  const existingPlans = await plansCollection.get()
  if (!existingPlans.empty) {
    console.log("Planos já existem. Pulando inicialização.")
    return
  }

  // Plano Trial
  await plansCollection.add({
    name: "Trial",
    description: "Experimente gratuitamente por 15 dias",
    price: 0,
    features: [
      "Gerenciamento básico de agendamentos",
      "Gerenciamento de clientes",
      "Gerenciamento de serviços",
      "Gerenciamento de disponibilidade",
      "Relatórios básicos",
    ],
    limits: {
      clients: 5,
      services: 3,
      appointments: 10,
    },
    type: "trial",
  })

  // Plano Essencial
  await plansCollection.add({
    name: "Essencial",
    description: "Para profissionais iniciantes",
    price: 49.9,
    features: [
      "Gerenciamento básico de agendamentos",
      "Gerenciamento de clientes",
      "Gerenciamento de serviços",
      "Gerenciamento de disponibilidade",
      "Relatórios básicos",
      "Notificações por email",
    ],
    limits: {
      clients: 50,
      services: 10,
      appointments: 9999, // Ilimitado
    },
    type: "essential",
  })

  // Plano Profissional
  await plansCollection.add({
    name: "Profissional",
    description: "Para profissionais estabelecidos",
    price: 99.9,
    features: [
      "Gerenciamento avançado de agendamentos",
      "Clientes ilimitados",
      "Serviços ilimitados",
      "Gerenciamento de disponibilidade",
      "Relatórios avançados",
      "Notificações por email, SMS e WhatsApp",
      "Pagamentos online",
      "Personalização de marca",
      "Acesso à API",
    ],
    limits: {
      clients: 9999, // Ilimitado
      services: 9999, // Ilimitado
      appointments: 9999, // Ilimitado
    },
    type: "professional",
  })

  console.log("Planos de assinatura inicializados com sucesso!")
}

initSubscriptionPlans()
  .then(() => {
    console.log("Script concluído com sucesso!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Erro ao executar script:", error)
    process.exit(1)
  })
