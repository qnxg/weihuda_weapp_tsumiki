import type { QueryFunction, QueryStatus, UseQueryOptions, UseQueryResult } from "./query"
import { useEffect, useMemo, useState } from "react"
import { Storage } from "@/utils/storage"
import { useQuery } from "./query"

/**
 * @description useCachedQuery 的扩展状态; 继承 QueryStatus, 补充 wx.storage 持久化相关的中间态
 *   - pending: 初始挂载, fetch 未完成 (无 storage 占位)
 *   - waiting: 重新 fetch 中, 且 storage 有 data 作为占位渲染
 *   - updating: fetch 成功, storage 写入中 (短暂)
 *   - success: fetch 成功, 写入完成
 *   - cached: fetch 失败, storage 有 data 兜底
 *   - error: fetch 失败, 无 storage 兜底
 */
export type CachedQueryStatus = QueryStatus | "waiting" | "updating" | "cached"

/**
 * @description useCachedQuery 返回值; 与 useQuery 一致, 但 status 字段类型扩展为 CachedQueryStatus
 * @template T - 响应数据类型, 约束 object | null
 */
export type UseCachedQueryResult<T extends object | null> = Omit<UseQueryResult<T>, "status"> & {
  status: CachedQueryStatus
}

/**
 * @description 带 wx.storage 持久化的取数 Hook
 *   内部封装 useQuery, fetch 成功时写 storage; storage 异步读在 fetch 未成功时作为 data 占位 / 失败时兜底
 * @template T - 响应数据类型, 约束 object | null
 * @param {QueryFunction<T>} fn - 取数函数
 * @param {unknown[]} [deps] - 变更检测数组; deps 变化时自动重新执行; 默认 []
 * @param {string} key - 存储键
 * @param {UseQueryOptions<T>} [options] - 配置项; 默认 {}
 * @returns {UseCachedQueryResult<T>} - 扩展 status 字段的 useQuery 返回值
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

  // 标记 storage 写入中, 用于派生 status="updating"
  const [isWritingStorage, setIsWritingStorage] = useState(false)

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
    onSuccess: (res) => {
      setIsWritingStorage(true)
      storage.set(res.data)
        .then(() => {
          // 写成功后同步 storageData, 让后续 refetch 能感知 "waiting" 状态 (fetch 中 + storage 占位渲染)
          setStorageData(res.data)
        })
        .catch(() => {
          // 写失败不影响当前数据流
        })
        .finally(() => {
          setIsWritingStorage(false)
        })
      options.onSuccess?.(res)
    },
  })

  const status: CachedQueryStatus = (() => {
    if (queryResult.fetchStatus === "fetching") {
      return storageData !== null ? "waiting" : "pending"
    }
    if (queryResult.status === "success") {
      return isWritingStorage ? "updating" : "success"
    }
    if (queryResult.status === "error") {
      return storageData !== null ? "cached" : "error"
    }
    return "pending"
  })()

  // 合并: fetch 未成功且 storage 有 data, 用 storage 作为 data (占位 / 失败兜底)
  const usingStorage = !queryResult.isSuccess && storageData !== null
  const data = usingStorage ? storageData : queryResult.data

  return {
    ...queryResult,
    data,
    status,
    // isPlaceholderData 保留 useQuery 原义: data 来自 placeholderData 选项或 storage 兜底
    isPlaceholderData: usingStorage || queryResult.isPlaceholderData,
  }
}
