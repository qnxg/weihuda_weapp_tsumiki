import type { Reducer } from "react"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { LABEL } from "@/config/logger-label"
import { RequestError } from "@/types/request"
import { logger } from "@/utils/logger"

/**
 * @description query 状态的取值
 *   - pending: 尚未有成功数据 (无 initialData 且 fetch 未成功)
 *   - error: 最近一次 fetch 失败
 *   - success: 最近一次 fetch 成功, 或 initialData 已写入
 */
export type QueryStatus = "pending" | "error" | "success"

/**
 * @description 取数状态的取值
 *   - fetching: 正在请求中
 *   - idle: 当前无请求
 */
export type FetchStatus = "fetching" | "idle"

/**
 * @description 取数函数; 不接收取消信号 (无 AbortSignal), 与 useRequest 一致采用悬空式取消
 * @template T - 响应数据类型, 约束 object | null
 */
export type QueryFunction<T extends object | null> = () => Promise<T>

/**
 * @description `placeholderData` 的 `keepPreviousData` 占位符
 *   表示 deps 变化时沿用上一次的数据作为占位渲染, 直到新 fetch 完成
 */
export const KEEP_PREVIOUS_DATA: unique symbol = Symbol("KEEP_PREVIOUS_DATA")
export type KeepPreviousData = typeof KEEP_PREVIOUS_DATA

/**
 * @description useQuery 配置项
 * @template T - 响应数据类型, 约束 object | null
 * @property {boolean} [enabled=true] - 是否自动执行; 为 false 时不自动 fetch, 仅 refetch 触发
 * @property {T | (() => T)} [initialData] - 预填充数据, 仅本次挂载的初始 state 生效, 不持久化
 * @property {T | ((prev: T | null) => T) | KeepPreviousData} [placeholderData] - 占位数据, 不入 state, 仅渲染
 * @property {(data: T) => void} [onSuccess] - 成功回调
 * @property {(err: RequestError) => void} [onError] - 失败回调
 * @property {(data: T | null, err: RequestError | null) => void} [onSettled] - 结束回调, 不论成败
 */
export interface UseQueryOptions<T extends object | null> {
  enabled?: boolean
  initialData?: T | (() => T)
  placeholderData?: T | ((prev: T | null) => T) | KeepPreviousData
  onSuccess?: (data: T) => void
  onError?: (err: RequestError) => void
  onSettled?: (data: T | null, err: RequestError | null) => void
}

/**
 * @description useQuery 内部 state; 实例级, 不做跨实例共享
 * @template T - 响应数据类型, 约束 object | null
 */
interface QueryState<T extends object | null> {
  status: QueryStatus
  fetchStatus: FetchStatus
  data: T | null
  error: RequestError | null
  dataUpdatedAt: number
  errorUpdatedAt: number
  failureCount: number
}

/**
 * @description useQuery 的实例级状态机
 * ## 状态字段
 *   1. status: pending / error / success (data 状态)
 *   2. fetchStatus: idle / fetching (请求状态)
 * ## 状态推进
 *   1. 触发 fetch: fetchStatus → fetching (status / data / error 保留)
 *   2. fetch resolve: status → success, fetchStatus → idle, error 清空, data 更新, failureCount = 0
 *   3. fetch reject: status → error, fetchStatus → idle, error 更新, data 保留, failureCount++
 *
 *   ## 取消语义
 *   与 useRequest 一致, 请求不真正中断; 实例卸载或 deps 变化触发新 fetch 时, 旧 fetch 完成会被忽略
 *   (countRef 计数比对, 不抛错, 仅不写入 state)
 */
function makeInitialState<T extends object | null>(
  initialData: UseQueryOptions<T>["initialData"],
): QueryState<T> {
  if (initialData !== undefined) {
    const resolved = typeof initialData === "function"
      ? (initialData as () => T)()
      : initialData
    return {
      status: "success",
      fetchStatus: "idle",
      data: resolved,
      error: null,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
    }
  }
  return {
    status: "pending",
    fetchStatus: "idle",
    data: null,
    error: null,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
  }
}

/**
 * @description placeholderData 的实例级状态机
 * ## 状态说明
 *   1. none: 当前无 placeholder, 渲染期显示 state data
 *   2. active: 当前显示 placeholder value, 直至 fetch 结束触发 CLEAR
 * ## 状态转换
 *   1. EVAL (deps 变化触发):
 *      - placeholderData = undefined → none
 *      - placeholderData = KEEP_PREVIOUS_DATA + lastData = null → none
 *      - placeholderData = KEEP_PREVIOUS_DATA + lastData != null → active (lastData)
 *      - placeholderData = function → active (fn(lastData))
 *      - placeholderData = value → active (value)
 *   2. CLEAR (fetch 成功或失败触发): → none
 */
type PlaceholderState<T extends object | null> = { kind: "none" } | { kind: "active", value: T }

type PlaceholderAction<T extends object | null>
  = | { type: "EVAL", placeholderData: UseQueryOptions<T>["placeholderData"], lastData: T | null }
    | { type: "CLEAR" }

function placeholderReducer<T extends object | null>(
  state: PlaceholderState<T>,
  action: PlaceholderAction<T>,
): PlaceholderState<T> {
  switch (action.type) {
    case "CLEAR":
      if (state.kind === "none")
        return state
      return { kind: "none" }
    case "EVAL": {
      const opt = action.placeholderData
      if (opt === undefined)
        return { kind: "none" }
      if (opt === KEEP_PREVIOUS_DATA) {
        if (action.lastData === null)
          return { kind: "none" }
        return { kind: "active", value: action.lastData }
      }
      if (typeof opt === "function") {
        return { kind: "active", value: opt(action.lastData) }
      }
      return { kind: "active", value: opt }
    }
    default:
      return state
  }
}

/**
 * @description useQuery 返回值
 * @template T - 响应数据类型, 约束 object | null
 * @property {T | null} data - 当前数据; placeholder 生效时返回 placeholder 值
 * @property {RequestError | null} error - 最近一次 fetch 的错误
 * @property {QueryStatus} status - 数据状态
 * @property {FetchStatus} fetchStatus - 取数状态
 * @property {boolean} isPending - 是否 `status === "pending"`
 * @property {boolean} isError - 是否 `status === "error"`
 * @property {boolean} isSuccess - 是否 `status === "success"`
 * @property {boolean} isLoading - 是否首次加载中 (`isPending && isFetching`)
 * @property {boolean} isFetching - 是否正在请求
 * @property {boolean} isLoadingError - 是否首次加载失败 (`isError && failureCount <= 1`)
 * @property {boolean} isRefetchError - 是否非首次失败 (`isError && failureCount > 1`)
 * @property {boolean} isPlaceholderData - 当前 data 是否来自 placeholderData
 * @property {() => Promise<void>} refetch - 主动重新触发 fetch, 等待 inflight 完成
 */
export interface UseQueryResult<T extends object | null> {
  data: T | null
  error: RequestError | null
  status: QueryStatus
  fetchStatus: FetchStatus
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  isFetching: boolean
  isLoadingError: boolean
  isRefetchError: boolean
  isPlaceholderData: boolean
  refetch: () => Promise<void>
}

/**
 * @description query 风格的取数 Hook
 *   每次挂载自动 fetch, deps 变化自动重新执行; 实例级独立, 不做跨组件共享
 *   持久化需求请用 `useCachedQuery` (基于本 hook + wx.storage 透传), 本 hook 不做任何持久化
 *   取消语义与 useRequest 一致: 请求悬空, 不真正中断; 实例卸载或 deps 变化时旧 fetch 结果会被忽略
 * @template T - 响应数据类型, 约束 object | null
 * @param {QueryFunction<T>} fn - 取数函数
 * @param {unknown[]} [deps] - 变更检测数组; deps 变化时自动重新执行; 默认 []
 * @param {UseQueryOptions<T>} [options] - 配置项; 默认 {}
 * @returns {UseQueryResult<T>} - 当前快照 + 衍生布尔 + refetch 句柄
 */
export function useQuery<T extends object | null>(
  fn: QueryFunction<T>,
  deps: unknown[] = [],
  options: UseQueryOptions<T> = {},
): UseQueryResult<T> {
  const {
    enabled = true,
  } = options

  // options 通过 ref 读取, fetch 内部始终拿到最新回调, 同时 deps 不被 options 引用变化污染
  const optionsRef = useRef(options)
  optionsRef.current = options

  // fn 通过 ref 读取, deps 不变时 fn 引用变化不触发 fetch (沿用 useRequest 惯例)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const [state, setState] = useState<QueryState<T>>(() => makeInitialState(options.initialData))

  // 实例级 inflight 计数, 用于实现悬空式取消 (与 useRequest countRef 惯例一致)
  const countRef = useRef(0)

  // placeholder 状态机 (实例级, 不入 state)
  const [placeholder, dispatchPlaceholder] = useReducer<Reducer<PlaceholderState<T>, PlaceholderAction<T>>>(
    placeholderReducer,
    { kind: "none" },
  )

  // 记录最近一次成功 data, 供 KEEP_PREVIOUS_DATA / 函数式 placeholderData 计算使用
  const lastDataRef = useRef<T | null>(state.data)
  useEffect(() => {
    lastDataRef.current = state.data
  }, [state.data])

  useEffect(() => {
    dispatchPlaceholder({
      type: "EVAL",
      placeholderData: optionsRef.current.placeholderData,
      lastData: lastDataRef.current,
    })
  }, [deps])

  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      dispatchPlaceholder({ type: "CLEAR" })
    }
  }, [state.status, state.dataUpdatedAt, state.errorUpdatedAt])

  // 触发 fetch; 实例级, 不复用 inflight
  const run = useCallback(async (): Promise<void> => {
    countRef.current += 1
    const currentCount = countRef.current

    setState(prev => ({ ...prev, fetchStatus: "fetching" }))

    try {
      const data = await fnRef.current()
      // 实例级取消检查: 计数被改动说明本次 fetch 已被新 fetch / 卸载取代, 静默丢弃结果
      if (currentCount !== countRef.current)
        return

      setState({
        status: "success",
        fetchStatus: "idle",
        data,
        error: null,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
      })

      const currentOnSuccess = optionsRef.current.onSuccess
      const currentOnSettled = optionsRef.current.onSettled
      currentOnSuccess?.(data)
      currentOnSettled?.(data, null)
    }
    catch (err) {
      if (currentCount !== countRef.current)
        return

      if (!(err instanceof RequestError)) {
        logger.error(LABEL.hook.request.REQUEST_HOOK_ERROR, err)
      }
      const myError = err instanceof RequestError
        ? err
        : new RequestError(-2, "REQUEST_HOOK_ERROR", null)

      setState(prev => ({
        ...prev,
        status: "error",
        fetchStatus: "idle",
        error: myError,
        errorUpdatedAt: Date.now(),
        failureCount: prev.failureCount + 1,
      }))

      const currentOnError = optionsRef.current.onError
      const currentOnSettled = optionsRef.current.onSettled
      currentOnError?.(myError)
      currentOnSettled?.(null, myError)
    }
  }, [])

  useEffect(() => {
    if (!enabled)
      return
    void run()
    return () => {
      // 卸载或 deps 变化时, 让进行中的 fetch 静默丢弃结果
      countRef.current += 1
    }
  }, [enabled, deps, run])

  const refetch = useCallback(async (): Promise<void> => {
    await run()
  }, [run])

  // 渲染用 data: placeholder 优先于 state data
  const data = placeholder.kind === "active" ? placeholder.value : state.data

  return {
    data,
    error: state.error,
    status: state.status,
    fetchStatus: state.fetchStatus,
    isPending: state.status === "pending",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    isLoading: state.status === "pending" && state.fetchStatus === "fetching",
    isFetching: state.fetchStatus === "fetching",
    isLoadingError: state.status === "error" && state.failureCount <= 1,
    isRefetchError: state.status === "error" && state.failureCount > 1,
    isPlaceholderData: placeholder.kind === "active",
    refetch,
  }
}
