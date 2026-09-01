import type { Refresher } from "@/pages/index/contexts/card-loading"
import { useCallback } from "react"
import { useCardLoadingContext } from "@/pages/index/contexts/card-loading"

/**
 * @property {(key: string, fn: Refresher) => void} registerCard - 注册卡片刷新函数
 * @property {(key: string) => void} unregisterCard - 注销卡片刷新函数
 * @property {() => Promise<void>} triggerRefresh - 触发所有已注册卡片的刷新函数执行, 全部完成后 resolved
 */
interface CardLoadingResult {
  registerCard: (key: string, fn: Refresher) => void
  unregisterCard: (key: string) => void
  triggerRefresh: () => Promise<void>
}

/**
 * @description 卡片加载注册与下拉刷新触发 Hook, 用于统一管理 Index 页面所有卡片的刷新协作
 *   - registerCard / unregisterCard 在 effect 中成对出现: 挂载时注册, 卸载时注销, 避免闭包滞留
 *   - triggerRefresh 快照当前全部刷新函数并异步等待完成, 单卡片失败不影响整体
 * @returns {CardLoadingResult} 卡片刷新协作的注册与触发方法
 * @example
 * ```tsx
 * const { registerCard, unregisterCard, triggerRefresh } = useCardLoading()
 *
 * useEffect(() => {
 *   registerCard(cardKey, refetch)
 *   return () => unregisterCard(cardKey)
 * }, [registerCard, unregisterCard, cardKey, refetch])
 * ```
 */
export function useCardLoading(): CardLoadingResult {
  const { registerCard, unregisterCard, getRefreshers } = useCardLoadingContext()

  // 刷新编排: 快照注册表后逐个触发, allSettled 隔离单卡片失败, 不影响整体与其余卡片
  const triggerRefresh = useCallback(async () => {
    const fns = getRefreshers()
    await Promise.allSettled(fns.map(fn => fn()))
  }, [getRefreshers])

  return {
    registerCard,
    unregisterCard,
    triggerRefresh,
  }
}
