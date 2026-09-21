import type { RequestContext, ResponseMeta } from "@/types/request"
import { request } from "@tarojs/taro"
import { LABEL } from "@/config/logger-label"
import { AbortError, NetworkError } from "@/types/request/error"
import { logger } from "@/utils/logger"

/**
 * @description 通用请求适配器
 */
export function adapter(context: RequestContext): Promise<ResponseMeta> {
  return new Promise((resolve, reject) => {
    const { url, method, headers, signal, timeout, body } = context.request

    if (signal.aborted) {
      reject(new AbortError())
      return
    }

    const task = request({
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
          logger.error(LABEL.lib.request.NETWORK_ERROR, `${method} ${url}: `, err)
          reject(new NetworkError(err.errMsg, err))
        }
      },
    })

    signal.onAbort = () => {
      task.abort()
    }
  })
}
