import { useCallback, useEffect, useMemo, useState } from "react"
import { Storage } from "@/utils/storage"

/**
 * @template T - 存储数据的类型
 * @property {T | undefined} data - 当前存储的数据, 未加载或已删除时为 undefined
 * @property {boolean} isError - 是否发生错误 (加载完成且数据为 undefined 时为 true)
 * @property {boolean} isLoading - 是否正在加载数据
 * @property {boolean} isRefreshing - 是否正在刷新数据
 * @property {boolean} isUpdating - 是否正在更新数据 (设置或删除)
 * @property {() => Promise<T | undefined>} refresh - 刷新数据的函数
 * @property {(value: T) => Promise<void>} set - 设置数据的函数
 * @property {() => Promise<void>} remove - 删除数据的函数
 */
interface StorageResult<T> {
  data: T | undefined
  isError: boolean
  isLoading: boolean
  isRefreshing: boolean
  isUpdating: boolean
  refresh: () => Promise<T | undefined>
  set: (value: T) => Promise<void>
  remove: () => Promise<void>
}

/**
 * @description 异步存储 Hook
 * @template T - 存储数据的类型
 * @param {string} key - 存储键
 */
export function useStorage<T>(key: string): StorageResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const isError = useMemo(() => !isLoading && data === undefined, [isLoading, data])

  const storage = useMemo(() => new Storage<T>(key), [key])

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
    isError,
    isLoading,
    isRefreshing,
    isUpdating,
    refresh,
    set,
    remove,
  }
}
