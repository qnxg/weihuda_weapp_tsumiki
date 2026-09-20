import type { RequestContext, ResponseMeta } from "@/types/new-request"
import { request } from "@tarojs/taro"
import { AbortError, NetworkError } from "@/types/new-request/error"

export function adapter<T>(context: RequestContext): Promise<ResponseMeta<T>> {
  return new Promise((resolve, reject) => {
    const { url, method, headers, signal, timeout, body } = context.request

    if (signal.aborted) {
      reject(new AbortError())
      return
    }

    const task = request<T>({
      url,
      method,
      header: headers,
      timeout,
      data: body,
      success: (res) => {
        resolve({
          status: res.statusCode,
          text: res.errMsg,
          headers: res.header,
          data: res.data,
        })
      },
      fail: (err) => {
        if (signal.aborted) {
          reject(new AbortError())
        }
        else {
          reject(new NetworkError(err.errMsg, err))
        }
      },
    })

    signal.onAbort = () => {
      task.abort()
    }
  })
}
