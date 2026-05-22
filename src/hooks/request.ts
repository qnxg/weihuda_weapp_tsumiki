import type { Response } from "@/utils/request"
import { useCallback, useEffect, useRef, useState } from "react"
import { RequestError } from "@/utils/request"

/**
 * @class RequestCancelledError - 请求取消错误类
 */
export class RequestCancelledError extends Error {
  constructor() {
    super("Request cancelled")
    this.name = "RequestCancelledError"
  }
}

/**
 * @interface RequestHookOptions - useRequest 配置项
 * @template T - 响应数据的类型
 * @property {boolean} [refetchClearData=true] - 重新请求前是否清空 data, 默认为 true
 * @property {boolean} [refetchClearError=true] - 重新请求前是否清空 error, 默认为 true
 * @property {boolean} [initLoadingState=true] - 初始 isLoading 状态, 默认为 true
 * @property {((fn: () => Promise<Response<T>>) => void) | null} [onRefetch=null] - 重新请求回调
 * @property {((res: Response<T> | null, err: RequestError<T> | null) => void) | null} [onSettled=null] - 请求结束回调
 * @property {((res: Response<T>) => void) | null} [onSuccess=null] - 请求成功回调
 * @property {((err: RequestError<T>) => void) | null} [onError=null] - 请求失败回调
 */
export interface RequestHookOptions<T> {
  refetchClearData?: boolean
  refetchClearError?: boolean
  initLoadingState?: boolean
  onRefetch?: ((fn: () => Promise<Response<T>>) => void) | null
  onSettled?: ((res: Response<T> | null, err: RequestError<T> | null) => void) | null
  onSuccess?: ((res: Response<T>) => void) | null
  onError?: ((err: RequestError<T>) => void) | null
}

/**
 * @function useRequest - 通用异步请求 Hook
 * @template T - 响应数据的类型
 * @param {() => Promise<Response<T>>} fn - 异步请求函数
 * @param deps - 依赖项数组 (当其中的值发生变化时会重新执行请求)
 * @param {RequestHookOptions} [options] - 配置项
 */
export function useRequest<T>(
  fn: () => Promise<Response<T>>,
  deps: unknown[] = [],
  options: RequestHookOptions<T> = {},
) {
  const {
    refetchClearData = true,
    refetchClearError = true,
    initLoadingState = true,
    onRefetch = null,
    onSettled = null,
    onSuccess = null,
    onError = null,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<RequestError<T> | null>(null)
  const [isLoading, setIsLoading] = useState(initLoadingState)
  const countRef = useRef(0)

  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async (): Promise<Response<T>> => {
    countRef.current += 1
    const currentCount = countRef.current

    setIsLoading(true)
    if (refetchClearData)
      setData(null)
    if (refetchClearError)
      setError(null)

    onRefetch?.(run)

    return fnRef.current()
      .then((res) => {
        // 请求已取消
        if (currentCount !== countRef.current) {
          throw new RequestCancelledError()
        }

        setData(res.data)
        onSuccess?.(res)
        onSettled?.(res, null)
        return res
      })
      .catch((err) => {
        // .then() 抛出的请求取消错误也会捕捉, 继续抛出
        if (err instanceof RequestCancelledError) {
          throw err
        }

        // 请求已取消
        if (currentCount !== countRef.current) {
          throw new RequestCancelledError()
        }

        // request 函数只会抛出 RequestError, 其他错误都视为 hook 使用错误, 需要封装为 RequestError 抛出
        if (!(err instanceof RequestError)) {
          console.error("[Request Hook Error]", err)
        }

        const myError = err instanceof RequestError
          ? err
          : new RequestError(-2, "REQUEST_HOOK_ERROR", {} as T)

        setError(myError)
        onError?.(myError)
        onSettled?.(null, myError)
        throw myError
      })
      .finally(() => {
        if (currentCount === countRef.current) {
          setIsLoading(false)
        }
      })
  }, [refetchClearData, refetchClearError, onRefetch, onSettled, onSuccess, onError])

  useEffect(() => {
    void run()
      .catch((err) => {
        if (!(err instanceof RequestCancelledError)) {
          console.error(err)
        }
      })

    return () => {
      countRef.current += 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, run])

  return {
    data,
    error,
    isLoading,
    refetch: run,
  }
}
