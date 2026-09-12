import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useMemo, useRef } from "react"

/**
 * @description 卡片刷新函数类型
 *   兼容 useQuery / useCachedQuery 的 refetch (() => Promise<Response<T>>)
 *   必须返回 Promise: 保证 triggerRefresh 的 allSettled 能等待完成, 同步函数的异常也不会逃逸出 allSettled
 */
export type Refresher = () => Promise<unknown>

interface CardLoadingContextValue {
  registerCard: (key: string, fn: Refresher) => void
  unregisterCard: (key: string) => void
  getRefreshers: () => Refresher[]
}

const CardLoadingContext = createContext<CardLoadingContextValue | null>(null)

/**
 * @description 首页卡片加载协作 Provider
 *   - 仅承载注册表原语 (注册 / 注销 / 读取), 刷新编排逻辑在 hooks/card-loading.ts, 遵循状态业务分离
 *   - 注册表为共享状态, 持有于 React 机制内的 useRef: 注册 / 注销只改 Map 不触发重渲染, 避免卡片注册引发级联更新
 */
export function CardLoadingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const storeRef = useRef<Map<string, Refresher> | null>(null)
  storeRef.current ??= new Map()

  const registerCard = useCallback((key: string, fn: Refresher) => {
    storeRef.current?.set(key, fn)
  }, [])

  const unregisterCard = useCallback((key: string) => {
    storeRef.current?.delete(key)
  }, [])

  const getRefreshers = useCallback(
    () => Array.from(storeRef.current?.values() ?? []),
    [],
  )

  const value = useMemo(() => ({
    registerCard,
    unregisterCard,
    getRefreshers,
  }), [registerCard, unregisterCard, getRefreshers])

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
