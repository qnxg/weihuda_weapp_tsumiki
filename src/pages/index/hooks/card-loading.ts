import { useCardLoadingContext } from "@/pages/index/contexts/card-loading"

/**
 * @description 卡片加载注册与下拉刷新触发 Hook, 用于统一管理 Index 页面所有卡片的刷新协作
 *   - registerCard / unregisterCard 在 effect 中成对出现: 挂载时注册, 卸载时注销, 避免闭包滞留
 *   - triggerRefresh 异步等待所有已注册卡片完成, 全部结束后 resolved
 */
export function useCardLoading() {
  return useCardLoadingContext()
}
