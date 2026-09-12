import type { Refresher } from "@/pages/index/contexts/card-loading"
import { useCallback, useEffect } from "react"
import { useCardLoadingContext } from "@/pages/index/contexts/card-loading"

/**
 * @description 卡片注册 Hook (卡片侧), 在 effect 中成对执行注册 / 注销: 挂载时注册刷新函数, 卸载时注销, 避免闭包滞留
 * @param {string} cardKey - 卡片唯一标识, 同时作为注册表的键
 * @param {Refresher} refetch - 卡片刷新函数, 引用变化时自动重新注册
 * @example
 * ```tsx
 * const { refetch } = useQuery(() => api.card.info())
 * useCardRegistration(cardKey, refetch)
 * ```
 */
export function useCardRegistration(cardKey: string, refetch: Refresher) {
  const { registerCard, unregisterCard } = useCardLoadingContext()

  useEffect(() => {
    registerCard(cardKey, refetch)
    return () => unregisterCard(cardKey)
  }, [registerCard, unregisterCard, cardKey, refetch])
}

/**
 * @property {() => Promise<void>} triggerRefresh - 触发所有已注册卡片的刷新函数执行, 全部完成后 resolved
 */
interface CardLoadingResult {
  triggerRefresh: () => Promise<void>
}

/**
 * @description 卡片刷新触发 Hook (页面侧), 用于下拉刷新时通知所有已注册卡片协作刷新
 *   - triggerRefresh 快照当前全部已注册刷新函数并异步等待完成, 单卡片失败不影响整体
 *   - 卡片侧注册请使用 useCardRegistration
 * @returns {CardLoadingResult} 卡片刷新触发方法
 */
export function useCardLoading(): CardLoadingResult {
  const { getRefreshers } = useCardLoadingContext()

  // 刷新编排: 快照注册表后逐个触发, allSettled 隔离单卡片失败, 不影响整体与其余卡片
  const triggerRefresh = useCallback(async () => {
    const fns = getRefreshers()
    await Promise.allSettled(fns.map(fn => fn()))
  }, [getRefreshers])

  return {
    triggerRefresh,
  }
}
