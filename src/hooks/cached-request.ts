import type { Reducer } from "react"
import type { Response } from "@/types/request"
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react"
import { LABEL } from "@/config/logger-label"
import { RequestError } from "@/types/request"
import { logger } from "@/utils/logger"
import { Storage } from "@/utils/storage"

type RequestStatus = "loading" | "success" | "error"
type CacheStatus = "loading" | "success" | "error"
type Status = "loading" | "waiting" | "updating" | "success" | "cached" | "error"

interface State<T> {
  status: Status
  data: T | null
  error: RequestError | null
  isLoading: boolean
  isUpdating: boolean
  requestStatus: RequestStatus
  cacheStatus: CacheStatus
}

type Action<T>
  = | { type: "INIT" }
    | { type: "REFETCH" }
    | { type: "CACHE_SUCCESS", payload: T }
    | { type: "CACHE_FAIL" }
    | { type: "REQUEST_SUCCESS", payload: T }
    | { type: "REQUEST_FAIL", payload: RequestError }
    | { type: "CACHE_UPDATED" }

/**
 * @description useCachedRequest 的 reducer 状态机
 * ## 状态说明
 *   1. loading: 加载状态 - 请求和缓存读取中, 或任一失败另一读取中, 此时 isLoading: true, data 和 error 保持不变(没有新数据)
 *   2. waiting: 等待状态 - 缓存读取成功但请求未完成, 此时 isLoading: false, data 为缓存数据, error 保持不变
 *   3. updating: 更新状态 - 请求成功后更新缓存中, 此时 isLoading: true, isUpdating: true, data 为请求数据(新数据), error 清空
 *   4. success: 成功状态 - 请求成功且缓存更新完成, 此时 isLoading: false, isUpdating: false, data 保持不变(新数据), error 保持不变(清空)
 *   5. cached: 缓存状态 - 请求失败但缓存读取成功, 此时 isLoading: false, data 为缓存数据, error 保持不变(请求错误)
 *   6. error: 失败状态 - 请求和换成读取均失败, 或请求失败且缓存读取未完成, 此时 isLoading: false, data 保持不变, error 为请求错误
 * ## Action 说明
 *   1. INIT: 同时开始请求和缓存读取, 进入加载状态
 *   2. REFETCH: 重新请求, 进入等待状态
 *   3. CACHE_SUCCESS: 缓存读取成功, 如果请求未完成则进入等待状态, 请求成进入更新状态, 请求失败进入缓存状态
 *   4. CACHE_FAIL: 缓存读取失败, 如果请求未完成为加载状态, 请求成功则进入更新状态, 否则进入错误状态
 *   5. REQUEST_SUCCESS: 请求成功, 开始更新缓存, 进入更新状态
 *   6. REQUEST_FAIL: 请求失败, 如果缓存未读取完成为等待状态, 缓存读取成功则进入缓存状态, 否则进入错误状态
 *   7. CACHE_UPDATED: 缓存更新完成, 进入成功状态
 */
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        status: "loading",
        isLoading: true,
        isUpdating: false,
        requestStatus: "loading",
        cacheStatus: "loading",
      }
    case "REFETCH":
      return {
        ...state,
        status: "waiting",
        isLoading: false,
        isUpdating: false,
        requestStatus: "loading",
      }
    case "CACHE_SUCCESS":
      switch (state.requestStatus) {
        case "loading":
          return {
            ...state,
            status: "waiting",
            data: action.payload,
            isLoading: false,
            cacheStatus: "success",
          }
        case "success":
          return {
            ...state,
            status: "updating",
            data: action.payload,
            isLoading: true,
            isUpdating: true,
            cacheStatus: "success",
          }
        case "error":
          return {
            ...state,
            status: "cached",
            data: action.payload,
            isLoading: false,
            cacheStatus: "success",
          }
        default:
          return state
      }
    case "CACHE_FAIL":
      switch (state.requestStatus) {
        case "loading":
          return {
            ...state,
            status: "loading",
            isLoading: true,
            cacheStatus: "error",
          }
        case "success":
          return {
            ...state,
            status: "updating",
            isLoading: true,
            isUpdating: true,
            cacheStatus: "error",
          }
        case "error":
          return {
            ...state,
            status: "error",
            isLoading: false,
            cacheStatus: "error",
          }
        default:
          return state
      }
    case "REQUEST_SUCCESS":
      switch (state.cacheStatus) {
        case "loading":
          return {
            ...state,
            status: "updating",
            data: action.payload,
            error: null,
            isLoading: true,
            isUpdating: true,
            requestStatus: "success",
          }
        case "success":
          return {
            ...state,
            status: "updating",
            data: action.payload,
            error: null,
            isLoading: true,
            isUpdating: true,
            requestStatus: "success",
          }
        case "error":
          return {
            ...state,
            status: "updating",
            data: action.payload,
            error: null,
            isLoading: true,
            isUpdating: true,
            requestStatus: "success",
          }
        default:
          return state
      }
    case "REQUEST_FAIL":
      switch (state.cacheStatus) {
        case "loading":
          return {
            ...state,
            status: "waiting",
            isLoading: false,
            requestStatus: "error",
            error: action.payload,
          }
        case "success":
          return {
            ...state,
            status: "cached",
            isLoading: false,
            requestStatus: "error",
            error: action.payload,
          }
        case "error":
          return {
            ...state,
            status: "error",
            isLoading: false,
            requestStatus: "error",
            error: action.payload,
          }
        default:
          return state
      }
    case "CACHE_UPDATED":
      return {
        ...state,
        status: "success",
        isLoading: false,
        isUpdating: false,
      }
    default:
      return state
  }
}

/**
 * @description 缓存请求 Hook 配置项
 * @property {boolean} [enabled=true] - 是否启用自动请求和缓存读取
 */
interface CachedRequestOptions {
  enabled?: boolean
}

/**
 * @template T - 响应数据的类型
 * @property {Status} status - 当前状态
 * @property {T | null} data - 响应数据
 * @property {RequestError | null} error - 错误信息
 * @property {boolean} isLoading - 是否加载中
 * @property {boolean} isUpdating - 是否更新缓存中
 * @property {boolean} isIdle - 是否空闲
 * @property {() => void} refetch - 重新发起请求
 */
interface CachedRequestResult<T> {
  status: Status
  data: T | null
  error: RequestError | null
  isLoading: boolean
  isUpdating: boolean
  isIdle: boolean
  refetch: () => void
}

/**
 * @description 带缓存请求 Hook
 * @template T - 响应数据的类型
 * @param {() => Promise<Response<T>>} fn - 异步请求函数
 * @param {string} key - 存储键
 * @param {CachedRequestOptions} [options] - 配置项
 */
export function useCachedRequest<T extends object | null>(
  fn: () => Promise<Response<T>>,
  key: string,
  options: CachedRequestOptions = {},
): CachedRequestResult<T> {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, {
    status: "loading",
    data: null,
    error: null,
    isLoading: true,
    isUpdating: false,
    requestStatus: "loading",
    cacheStatus: "loading",
  })
  const isIdle = useMemo(() => (state.status === "success" || state.status === "cached" || state.status === "error"), [state.status])

  const storageRef = useRef<Storage<T> | null>(null)

  useEffect(() => {
    storageRef.current = new Storage<T>(key)
  }, [key])

  // 用于更新状态机的请求函数
  const requestFn = useCallback((storage: Storage<T>) => {
    fn()
      .then((res) => {
        dispatch({ type: "REQUEST_SUCCESS", payload: res.data })
        return storage.set(res.data)
      })
      .then(() => {
        dispatch({ type: "CACHE_UPDATED" })
      })
      .catch((err) => {
        // request 函数只会抛出 RequestError, 其他错误都视为 hook 使用错误, 需要封装为 RequestError 抛出
        if (!(err instanceof RequestError)) {
          logger.fatal(LABEL.hook.request.REQUEST_HOOK_ERROR, err)
        }

        const myError = err instanceof RequestError
          ? err
          : new RequestError(-2, "REQUEST_HOOK_ERROR", null)
        dispatch({ type: "REQUEST_FAIL", payload: myError })
      })
  }, [fn])

  // 用于更新状态机的缓存读取函数
  const cacheFn = useCallback(() => {
    const storage = storageRef.current
    if (!storage)
      return

    storage.get()
      .then((cachedData) => {
        if (cachedData !== undefined) {
          dispatch({ type: "CACHE_SUCCESS", payload: cachedData as T })
        }
        else {
          dispatch({ type: "CACHE_FAIL" })
        }
      })
      .catch(() => {
        dispatch({ type: "CACHE_FAIL" })
      })
  }, [])

  // 初始化时同时发起请求和缓存读取
  const execute = useCallback(() => {
    dispatch({ type: "INIT" })

    const storage = storageRef.current
    if (!storage)
      return

    requestFn(storage)
    cacheFn()
  }, [cacheFn, requestFn])

  useEffect(() => {
    if (options?.enabled === false)
      return
    void execute()
  }, [execute, options?.enabled])

  // 重新请求, 保留数据和错误
  const refetch = useCallback(() => {
    if (!isIdle)
      return

    dispatch({ type: "REFETCH" })
    const storage = storageRef.current
    if (storage)
      requestFn(storage)
  }, [isIdle, requestFn])

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isUpdating: state.isUpdating,
    isIdle,
    refetch,
  }
}
