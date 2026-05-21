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
 * @function useRequest - 通用异步请求 Hook
 * @template T - 响应数据的类型
 * @param {() => Promise<Response<T>>} fn - 异步请求函数
 * @param deps - 依赖项数组 (当其中的值发生变化时会重新执行请求)
 */
export function useRequest<T>(
  fn: () => Promise<Response<T>>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<RequestError<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const countRef = useRef(0)

  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async (): Promise<Response<T>> => {
    countRef.current += 1
    const currentCount = countRef.current

    setIsLoading(true)
    setError(null)

    return fnRef.current()
      .then((res) => {
        if (currentCount !== countRef.current) {
          throw new RequestCancelledError()
        }

        setData(res.data)
        return res
      })
      .catch((err) => {
        if (err instanceof RequestCancelledError) {
          throw err
        }

        if (currentCount !== countRef.current) {
          throw new RequestCancelledError()
        }

        if (!(err instanceof RequestError)) {
          console.error("Non-server request error: ", err)
        }

        const myError = err instanceof RequestError
          ? err
          : new RequestError(-1, {} as Response<T>)
        setError(myError)
        throw myError
      })
      .finally(() => {
        if (currentCount === countRef.current) {
          setIsLoading(false)
        }
      })
  }, [])

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
