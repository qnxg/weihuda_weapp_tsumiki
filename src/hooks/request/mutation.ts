import type { Response } from "@/types/request"
import { useCallback, useRef, useState } from "react"
import { LABEL } from "@/config/logger-label"
import { RequestError } from "@/types/request"
import { logger } from "@/utils/logger"

/**
 * @description mutation 状态的取值
 *   - idle: 未触发或已 reset; data / error / variables / context 全部清空
 *   - pending: mutate 已触发, fn 未 resolve
 *   - error: 最近一次 mutate 失败 (fn 抛错或 onMutate 抛错)
 *   - success: 最近一次 mutate 成功
 */
export type MutationStatus = "idle" | "pending" | "error" | "success"

/**
 * @description mutation 函数; 接收 vars, 返回 Promise<Response<T>>
 * @template T - 响应数据类型, 约束 object | null
 * @template TVariables - mutate 传入参数类型
 */
export type MutationFunction<T extends object | null, TVariables> = (vars: TVariables) => Promise<Response<T>>

/**
 * @description useMutation 配置项
 * @template T - 响应数据类型, 约束 object | null
 * @template TVariables - mutate 传入参数类型, 默认 void
 * @template TContext - onMutate 返回值透传类型, 默认 unknown
 * @property {(vars: TVariables) => TContext | Promise<TContext> | undefined} [onMutate] - mutate 前回调; 返回值经 context 透传给后续回调
 * @property {(res: Response<T>, vars: TVariables, context: TContext | undefined) => void} [onSuccess] - 成功回调
 * @property {(err: RequestError, vars: TVariables, context: TContext | undefined) => void} [onError] - 失败回调
 * @property {(res: Response<T> | null, err: RequestError | null, vars: TVariables, context: TContext | undefined) => void} [onSettled] - 结束回调, 不论成败
 */
export interface UseMutationOptions<T extends object | null, TVariables = void, TContext = unknown> {
  onMutate?: (vars: TVariables) => TContext | Promise<TContext> | undefined
  onSuccess?: (res: Response<T>, vars: TVariables, context: TContext | undefined) => void
  onError?: (err: RequestError, vars: TVariables, context: TContext | undefined) => void
  onSettled?: (res: Response<T> | null, err: RequestError | null, vars: TVariables, context: TContext | undefined) => void
}

/**
 * @description mutate 调用时的一次性回调; 用于覆盖 options 中的对应回调
 * @template T - 响应数据类型
 * @template TVariables - mutate 传入参数类型
 * @property {(res: Response<T>, vars: TVariables) => void} [onSuccess] - 一次性成功回调
 * @property {(err: RequestError, vars: TVariables) => void} [onError] - 一次性失败回调
 * @property {(res: Response<T> | null, err: RequestError | null, vars: TVariables) => void} [onSettled] - 一次性结束回调
 */
export interface MutationCallbacks<T extends object | null, TVariables = void> {
  onSuccess?: (res: Response<T>, vars: TVariables) => void
  onError?: (err: RequestError, vars: TVariables) => void
  onSettled?: (res: Response<T> | null, err: RequestError | null, vars: TVariables) => void
}

/**
 * @description useMutation 内部 state; 实例级, 不做跨实例共享
 * @template T - 响应数据类型, 约束 object | null
 * @template TVariables - mutate 传入参数类型
 * @template TContext - onMutate 返回值透传类型
 */
interface MutationState<T extends object | null, TVariables, TContext> {
  status: MutationStatus
  data: T | null
  error: RequestError | null
  variables: TVariables | undefined
  context: TContext | undefined
}

/**
 * @description useMutation 的实例级状态机
 * ## 状态字段
 *   1. status: idle / pending / success / error (mutation 状态)
 *   2. data / error / variables / context: 最近一次 mutate 的快照; pending 期间 data / error 保留
 * ## 状态推进
 *   1. 触发 mutate: status → pending (variables / context 写入; data / error 保留, 便于 UI 同时显示上次结果)
 *   2. onMutate 抛错: status → error, error → myError; 不调用 fn, 不进入 pending
 *   3. fn resolve: status → success, data → 新值, error → null, variables / context 保留
 *   4. fn reject: status → error, error → myError, data 保留
 *   5. reset: status → idle, data / error / variables / context 全部清空
 *
 *   ## 串行语义
 *   同实例的 mutate 串行执行, 第二次 mutate 会 await 第一次完成 (不论第一次成败)
 *
 *   ## 取消语义
 *   沿用 useRequest 悬空式, mutate 不取消已发起的 fn; 实例卸载后 fn 仍会完成, 但 setState 在卸载后无效
 */
function makeInitialState<T extends object | null, TVariables, TContext>(): MutationState<T, TVariables, TContext> {
  return {
    status: "idle",
    data: null,
    error: null,
    variables: undefined,
    context: undefined,
  }
}

/**
 * @description useMutation 返回值
 * @template T - 响应数据类型, 约束 object | null
 * @template TVariables - mutate 传入参数类型, 默认 void
 * @template TContext - onMutate 返回值透传类型, 默认 unknown
 * @property {T | null} data - 最近一次 mutate 成功的数据; reset 后为 null
 * @property {RequestError | null} error - 最近一次 mutate 失败的错误; reset 后为 null
 * @property {TVariables | undefined} variables - 最近一次 mutate 传入参数; reset 后为 undefined
 * @property {MutationStatus} status - mutation 状态
 * @property {boolean} isPending - 是否 `status === "pending"`
 * @property {boolean} isError - 是否 `status === "error"`
 * @property {boolean} isSuccess - 是否 `status === "success"`
 * @property {TContext | undefined} context - onMutate 返回值, 透传给后续回调; reset 后为 undefined
 * @property {(variables: TVariables, opts?: MutationCallbacks<T, TVariables>) => void} mutate - fire-and-forget 触发; 错误走 options.onError 与 opts.onError, 不抛
 * @property {(variables: TVariables) => Promise<Response<T>>} mutateAsync - await 触发; 错误 reject
 * @property {() => void} reset - 清空 mutation state 回 idle
 */
export interface UseMutationResult<T extends object | null, TVariables = void, TContext = unknown> {
  data: T | null
  error: RequestError | null
  variables: TVariables | undefined
  status: MutationStatus
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  context: TContext | undefined
  mutate: (variables: TVariables, opts?: MutationCallbacks<T, TVariables>) => void
  mutateAsync: (variables: TVariables) => Promise<Response<T>>
  reset: () => void
}

/**
 * @description mutation 风格的请求 Hook
 *   不自动执行, 必须显式 mutate(vars) 或 mutateAsync(vars); 实例级独立, 不做缓存 / 去重 / 失效
 *   同实例的 mutate 串行执行; 实例卸载后 mutate 不取消 (沿用 useRequest 悬空式)
 * @template T - 响应数据类型, 约束 object | null
 * @template TVariables - mutate 传入参数类型, 默认 void
 * @template TContext - onMutate 返回值透传类型, 默认 unknown
 * @param {MutationFunction<T, TVariables>} fn - mutation 函数
 * @param {UseMutationOptions<T, TVariables, TContext>} [options] - 配置项; 默认 {}
 * @returns {UseMutationResult<T, TVariables, TContext>} - 当前快照 + 触发句柄
 */
export function useMutation<T extends object | null, TVariables = void, TContext = unknown>(
  fn: MutationFunction<T, TVariables>,
  options: UseMutationOptions<T, TVariables, TContext> = {},
): UseMutationResult<T, TVariables, TContext> {
  // options 通过 ref 读取, mutate 内部始终拿到最新回调, 同时 fn 引用变化不触发重新订阅
  const optionsRef = useRef<UseMutationOptions<T, TVariables, TContext>>(options)
  optionsRef.current = options

  // fn 通过 ref 读取, mutate 调用时拿到最新 fn 引用 (沿用 useRequest 惯例)
  const fnRef = useRef<MutationFunction<T, TVariables>>(fn)
  fnRef.current = fn

  const [state, setState] = useState<MutationState<T, TVariables, TContext>>(makeInitialState)

  // 串行 inflight 链: 同实例的 mutate 串行执行, 第二次 mutate 会等第一次完成
  // 用 .then(noop, noop) 把结果/错误都吞掉, 让链上各 promise 永远 resolve, 不阻断后续 mutate
  const inflightRef = useRef<Promise<void> | null>(null)

  const mutateAsync = useCallback(async (vars: TVariables): Promise<Response<T>> => {
    // 串行: 等前一次完成 (不论成败, 都用 .then(noop, noop) 吞过 reject)
    if (inflightRef.current) {
      await inflightRef.current
    }

    // onMutate 阶段: 计算 context; 抛错则整体 mutation 失败, 不调用 fn
    let context: TContext | undefined
    try {
      context = await optionsRef.current.onMutate?.(vars)
    }
    catch (err) {
      if (!(err instanceof RequestError)) {
        logger.error(LABEL.hook.request.REQUEST_HOOK_ERROR, err)
      }
      const myError = err instanceof RequestError
        ? err
        : new RequestError(-2, "REQUEST_HOOK_ERROR", null)
      setState(prev => ({
        ...prev,
        status: "error",
        error: myError,
        variables: vars,
        context: undefined,
      }))
      optionsRef.current.onError?.(myError, vars, undefined)
      optionsRef.current.onSettled?.(null, myError, vars, undefined)
      throw myError
    }

    // pending: 推入状态机; data / error 保留以便 UI 同时显示上次结果
    setState(prev => ({
      ...prev,
      status: "pending",
      variables: vars,
      context,
    }))

    // 实际 mutation 执行
    const promise = (async () => {
      try {
        const res = await fnRef.current(vars)
        const data = res.data
        setState(prev => ({
          ...prev,
          status: "success",
          data,
          error: null,
          variables: vars,
          context,
        }))
        optionsRef.current.onSuccess?.(res, vars, context)
        optionsRef.current.onSettled?.(res, null, vars, context)
        return res
      }
      catch (err) {
        if (!(err instanceof RequestError)) {
          logger.error(LABEL.hook.request.REQUEST_HOOK_ERROR, err)
        }
        const myError = err instanceof RequestError
          ? err
          : new RequestError(-2, "REQUEST_HOOK_ERROR", null)
        setState(prev => ({
          ...prev,
          status: "error",
          error: myError,
        }))
        optionsRef.current.onError?.(myError, vars, context)
        optionsRef.current.onSettled?.(null, myError, vars, context)
        throw myError
      }
    })()

    // inflight 链: 把结果/错误都吞掉, 让后续 mutate 不被 reject 阻断
    inflightRef.current = promise.then(() => undefined, () => undefined)
    return promise
  }, [])

  const mutate = useCallback((vars: TVariables, opts?: MutationCallbacks<T, TVariables>): void => {
    void mutateAsync(vars)
      .then((res) => {
        opts?.onSuccess?.(res, vars)
        opts?.onSettled?.(res, null, vars)
      })
      .catch((err: unknown) => {
        const myError = err instanceof RequestError
          ? err
          : new RequestError(-2, "REQUEST_HOOK_ERROR", null)
        opts?.onError?.(myError, vars)
        opts?.onSettled?.(null, myError, vars)
      })
  }, [mutateAsync])

  const reset = useCallback((): void => {
    setState(makeInitialState())
  }, [])

  return {
    data: state.data,
    error: state.error,
    variables: state.variables,
    status: state.status,
    isPending: state.status === "pending",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    context: state.context,
    mutate,
    mutateAsync,
    reset,
  }
}
