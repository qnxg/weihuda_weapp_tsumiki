import type { ReactNode } from "react"
import { createContext, useContext, useMemo, useState } from "react"

interface ScrollContextValue {
  isScrollToLower: boolean
  setIsScrollToLower: (value: boolean) => void
}

/**
 * @description 由于积分页面子组件需要触底分页, 但滚动区定义在父组件上, 因此需要状态的 "广播" 机制
 *
 * 考虑到状态提升并不合适 (因为有多个子组件), 故使用 context 广播触底状态
 */
const ScrollContext = createContext<ScrollContextValue | null>(null)

export function ScrollProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [isScrollToLower, setIsScrollToLower] = useState(false)

  const value = useMemo(() => ({
    isScrollToLower,
    setIsScrollToLower,
  }), [isScrollToLower])

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContext() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider")
  }
  return context
}
