import type { PropsWithChildren } from "react"

import { UserProvider } from "@/contexts/user"
import "./app.scss"

export default function App({
  children,
}: PropsWithChildren<any>) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}
