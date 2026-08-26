import type { QueryFunction, UseQueryOptions, UseQueryResult } from "./query"
import { useEffect, useMemo, useState } from "react"
import { Storage } from "@/utils/storage"
import { useQuery } from "./query"

/**
 * @description useCachedQuery 返回值; 与 useQuery 一致
 * @template T - 响应数据类型, 约束 object | null
 */
export type UseCachedQueryResult<T extends object | null> = UseQueryResult<T>

/**
 * @description 带 wx.storage 持久化的取数 Hook
 *   内部封装 useQuery, fetch 成功时写 storage; storage 异步读在 fetch 未成功时作为 data 占位 / 失败时兜底
 * @template T - 响应数据类型, 约束 object | null
 * @param {QueryFunction<T>} fn - 取数函数
 * @param {unknown[]} [deps] - 变更检测数组; deps 变化时自动重新执行; 默认 []
 * @param {string} key - 存储键
 * @param {UseQueryOptions<T>} [options] - 配置项; 默认 {}
 * @returns {UseCachedQueryResult<T>} - 与 useQuery 一致的返回
 */
export function useCachedQuery<T extends object | null>(
  fn: QueryFunction<T>,
  deps: unknown[] = [],
  key: string,
  options: UseQueryOptions<T> = {},
): UseCachedQueryResult<T> {
  // Storage 实例按 key 派生; key 变时新建, 旧 storage 自然 GC
  const storage = useMemo(() => new Storage<T>(key), [key])

  // 异步读 storage; 完成后在 fetch 未成功时作为 data 占位 / 失败时兜底
  const [storageData, setStorageData] = useState<T | null>(null)

  useEffect(() => {
    let cancelled = false
    void storage.get()
      .then((data) => {
        if (cancelled)
          return
        if (data !== undefined)
          setStorageData(data)
      })
      .catch(() => {
        // best-effort: 读失败视为无缓存, fetch 照常进行
      })
    return () => {
      cancelled = true
    }
  }, [storage])

  // 内部调 useQuery, 仅包装 onSuccess 写 storage; 其余 options 透传
  const queryResult = useQuery(fn, deps, {
    ...options,
    onSuccess: (data) => {
      void storage.set(data).catch(() => {})
      options.onSuccess?.(data)
    },
  })

  // 合并: fetch 未成功且 storage 有 data, 用 storage 作为 data (占位 / 失败兜底)
  const usingStorage = !queryResult.isSuccess && storageData !== null
  const data = usingStorage ? storageData : queryResult.data

  return {
    ...queryResult,
    data,
    isPlaceholderData: usingStorage || queryResult.isPlaceholderData,
  }
}
