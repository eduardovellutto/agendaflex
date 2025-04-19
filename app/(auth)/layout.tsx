"use client"

import type React from "react"

import { AuthProviderClient } from "@/components/auth-provider-client"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProviderClient>{children}</AuthProviderClient>
}
