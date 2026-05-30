import type { ReactNode } from "react"
import type { UserInfo } from "@/types/user"
import { createContext, useContext, useMemo, useState } from "react"

interface UserContextValue {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({
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
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
