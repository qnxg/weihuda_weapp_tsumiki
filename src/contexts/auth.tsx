import type { ReactNode } from "react"
import type { UserInfo } from "@/types/auth"
import { createContext, useContext, useMemo, useState } from "react"

interface AuthContextValue {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [user, setUser] = useState<UserInfo | null>(null)

  const value = useMemo(() => ({
    user,
    setUser,
  }), [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return context
}
