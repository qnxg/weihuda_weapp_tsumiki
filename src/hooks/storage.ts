import { useCallback, useEffect, useMemo, useState } from "react"
import { MyStorage } from "@/libs/storage"

/**
 * @description 异步存储 Hook
 * @template T - 存储数据的类型
 * @param {string} key - 存储键
 */
export function useStorage<T>(key: string) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const storage = useMemo(() => new MyStorage<T>(key), [key])

  const refresh = useCallback(async (): Promise<T | undefined> => {
    if (isRefreshing || isUpdating)
      return

    setIsRefreshing(true)
    setIsLoading(true)

    const value = await storage.get()
    setData(value)
    setIsLoading(false)
    setIsRefreshing(false)

    return value
  }, [isRefreshing, isUpdating, storage])

  const set = useCallback(async (value: T): Promise<void> => {
    setIsUpdating(true)
    return storage.set(value).then(() => {
      setData(value)
    }).finally(() => {
      setIsUpdating(false)
    })
  }, [storage])

  const remove = useCallback(async (): Promise<void> => {
    setIsUpdating(true)
    return storage.remove().then(() => {
      setData(undefined)
    }).finally(() => {
      setIsUpdating(false)
    })
  }, [storage])

  useEffect(() => {
    void refresh()
  }, [key, refresh])

  return {
    data,
    isLoading,
    isRefreshing,
    isUpdating,
    refresh,
    set,
    remove,
  }
}
