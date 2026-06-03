import type { Refresher } from "@/pages/index/contexts/card-loading"
import { useCallback, useMemo } from "react"
import { useCardLoadingContext } from "@/pages/index/contexts/card-loading"

/**
 * @property {boolean} isLoading - 是否正在加载 (count > 0)
 * @property {(key: string, fn: Refresher) => void} registerCard - 注册卡片刷新函数并增加计数
 * @property {(key: string) => void} unregisterCard - 注销卡片刷新函数并减少计数
 * @property {(key: string) => void} onCardFinish - 卡片请求完成时调用, 减少计数
 * @property {() => Promise<void>} triggerRefresh - 触发所有已注册卡片的刷新函数执行, 全部完成后 resolved
 */
interface CardLoadingResult {
  isLoading: boolean
  registerCard: (key: string, fn: Refresher) => void
  unregisterCard: (key: string) => void
  onCardFinish: (key: string) => void
  triggerRefresh: () => Promise<void>
}

/**
 * @description 卡片加载状态管理 Hook, 用于统一管理 Index 页面下所有卡片的加载状态
 */
export function useCardLoading(): CardLoadingResult {
  const {
    count,
    refreshers,
    setCount,
    addRefresher,
    removeRefresher,
  } = useCardLoadingContext()

  const isLoading = useMemo(() => count > 0, [count])

  const registerCard = useCallback((key: string, fn: Refresher) => {
    addRefresher(key, fn)
    setCount(count + 1)
  }, [addRefresher, setCount, count])

  const unregisterCard = useCallback((key: string) => {
    removeRefresher(key)
    setCount(count - 1)
  }, [removeRefresher, setCount, count])

  const onCardFinish = useCallback((_key: string) => {
    setCount(count - 1)
  }, [setCount, count])

  const triggerRefresh = useCallback(async () => {
    setCount(refreshers.size)
    await Promise.allSettled(Array.from(refreshers.values(), fn => fn()))
  }, [refreshers, setCount])

  return {
    isLoading,
    registerCard,
    unregisterCard,
    onCardFinish,
    triggerRefresh,
  }
}
