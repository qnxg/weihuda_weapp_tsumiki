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
 * @interface RequestHookOption - useRequest 配置项
 * @property {boolean} [refetchClearData=true] - 重新请求前是否清空 data, 默认为 true
 * @property {boolean} [refetchClearError=true] - 重新请求前是否清空 error, 默认为 true
 * @property {boolean} [initLoadingState=true] - 初始 isLoading 状态, 默认为 true
 */
export interface RequestHookOption {
  refetchClearData?: boolean
  refetchClearError?: boolean
  initLoadingState?: boolean
}

/**
 * @function useRequest - 通用异步请求 Hook
 * @template T - 响应数据的类型
 * @param {() => Promise<Response<T>>} fn - 异步请求函数
 * @param deps - 依赖项数组 (当其中的值发生变化时会重新执行请求)
 * @param {RequestHookOption} [options] - 配置项
 */
export function useRequest<T>(
  fn: () => Promise<Response<T>>,
  deps: unknown[] = [],
  options: RequestHookOption = {},
) {
  const { refetchClearData = true, refetchClearError = true, initLoadingState = true } = options

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
    if (refetchClearError)
      setError(null)

    return fnRef.current()
      .then((res) => {
        // 请求已取消
        if (currentCount !== countRef.current) {
          throw new RequestCancelledError()
        }

        if (refetchClearData)
          setData(res.data)
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

        if (refetchClearError)
          setError(myError)

        throw myError
      })
      .finally(() => {
        if (currentCount === countRef.current) {
          setIsLoading(false)
        }
      })
  }, [refetchClearData, refetchClearError])

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
