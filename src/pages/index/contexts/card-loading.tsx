import type { ReactNode } from "react"
import { createContext, useContext, useMemo, useRef } from "react"

/**
 * @description 卡片刷新函数类型
 *   兼容 useRequest.refetch (() => Promise<Response<T>>) 与 useCachedRequest.refetch (() => Promise<T | null>)
 */
export type Refresher = () => Promise<unknown> | void

interface CardLoadingContextValue {
  registerCard: (key: string, fn: Refresher) => void
  unregisterCard: (key: string) => void
  triggerRefresh: () => Promise<void>
}

const CardLoadingContext = createContext<CardLoadingContextValue | null>(null)

/**
 * @description 首页卡片加载协作 Provider
 *   - 卡片在 useEffect 中注册自己的刷新函数, 卸载时通过 cleanup 注销, 避免闭包滞留
 *   - 刷新函数集合存于 useRef, 不进 Context value, 注册不触发级联重渲染
 *   - triggerRefresh 快照当前全部刷新函数并异步等待完成, 单卡片失败不影响整体
 */
export function CardLoadingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  // 刷新函数集合, 用 ref 承载以保持引用稳定
  const storeRef = useRef(new Map<string, Refresher>())

  // 注册 / 注销 / 触发函数在 useMemo 中一次性创建, value 引用永不变, 彻底消除级联重渲染
  const value = useMemo(() => {
    const registerCard = (key: string, fn: Refresher) => {
      storeRef.current.set(key, fn)
    }

    const unregisterCard = (key: string) => {
      storeRef.current.delete(key)
    }

    const triggerRefresh = async () => {
      const fns = Array.from(storeRef.current.values())
      if (fns.length === 0) {
        return
      }
      await Promise.allSettled(fns.map(fn => fn()))
    }

    return { registerCard, unregisterCard, triggerRefresh }
  }, [])

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
