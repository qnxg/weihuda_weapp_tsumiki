import type { ReactNode } from "react"
import { createContext, useContext, useRef } from "react"

/**
 * @description 卡片刷新函数类型
 *   兼容 useQuery / useCachedQuery 的 refetch (() => Promise<Response<T>>) 与无返回值的同步刷新函数
 */
export type Refresher = () => Promise<unknown> | void

interface CardLoadingContextValue {
  registerCard: (key: string, fn: Refresher) => void
  unregisterCard: (key: string) => void
  getRefreshers: () => Refresher[]
}

const CardLoadingContext = createContext<CardLoadingContextValue | null>(null)

/**
 * @description 创建注册表原语; 注册表 Map 由闭包持有, 无组件作用域依赖
 */
function createCardLoadingValue(): CardLoadingContextValue {
  const store = new Map<string, Refresher>()

  return {
    registerCard: (key, fn) => {
      store.set(key, fn)
    },
    unregisterCard: (key) => {
      store.delete(key)
    },
    getRefreshers: () => Array.from(store.values()),
  }
}

/**
 * @description 首页卡片加载协作 Provider
 *   - 仅承载注册表原语 (注册 / 注销 / 读取), 刷新编排逻辑在 hooks/card-loading.ts, 遵循状态业务分离
 *   - value 惰性创建一次且引用永不变化, 注册不触发级联重渲染
 */
export function CardLoadingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  // value 惰性初始化, 避免每次渲染创建临时对象
  const valueRef = useRef<CardLoadingContextValue | null>(null)
  valueRef.current ??= createCardLoadingValue()

  return (
    <CardLoadingContext.Provider value={valueRef.current}>
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
