import type { ReactNode } from "react"
import { createContext, useContext, useMemo, useState } from "react"

export type Refresher = () => void

interface CardLoadingContextValue {
  count: number
  refreshers: Map<string, Refresher>
  setCount: (count: number) => void
  addRefresher: (key: string, refresher: Refresher) => void
  removeRefresher: (key: string) => void
}

const CardLoadingContext = createContext<CardLoadingContextValue | null>(null)

export function CardLoadingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [count, setCount] = useState(0)
  const [refreshers, setRefreshers] = useState(() => new Map<string, Refresher>())

  const addRefresher = (key: string, fn: Refresher) =>
    setRefreshers(p => new Map(p).set(key, fn))

  const removeRefresher = (key: string) =>
    setRefreshers((p) => {
      const next = new Map(p)
      next.delete(key)
      return next
    })

  const value = useMemo(() => ({
    count,
    refreshers,
    setCount,
    addRefresher,
    removeRefresher,
  }), [count, refreshers])

  return (
    <CardLoadingContext.Provider value={value}>
      {children}
    </CardLoadingContext.Provider>
  )
}

export function useCardLoadingContext() {
  const context = useContext(CardLoadingContext)
  if (!context) {
    throw new Error("useCardLoadingContext must be used within a CardLoadingProvider")
  }
  return context
}
