import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase-config"
import type { User } from "@/lib/types"
import { PublicBookingPage } from "@/components/public/public-booking-page"

interface PublicProfilePageProps {
  params: {
    username: string
  }
}

async function getUserByUsername(username: string): Promise<User | null> {
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", username))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  const userDoc = querySnapshot.docs[0]
  return { id: userDoc.id, ...userDoc.data() } as User
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = params

  // This would be a server component that fetches the user data
  // For now, we'll just return a placeholder
  // const user = await getUserByUsername(username)

  // if (!user) {
  //   notFound()
  // }

  // For demo purposes, we'll use a placeholder user
  const user = {
    id: "123",
    name: "Dr. Ana Silva",
    profession: "Psicóloga",
    email: "ana.silva@example.com",
  }

  return <PublicBookingPage user={user} />
}
