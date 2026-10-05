import type { OhNetAdapter, OhNetContext, OhNetResponse } from "@xtwis/ohnet"
import { request } from "@tarojs/taro"
import {
  OHNET_ADAPTER_ERROR_CODE,
  OHNET_ADAPTER_ERROR_MESSAGE,
  OhNetAdapterError,
  OhNetHeader,
  subscribeAbort,
} from "@xtwis/ohnet"
import { LABEL } from "@/config/logger-label"
import { logger } from "@/utils/logger"

/**
 * @description Taro.request 适配器, 唯一接触 `Taro.request` 的层
 * @param context - ohnet 解析后的请求上下文
 * @returns {Promise<OhNetResponse>} 归一化的 ohnet 响应
 */
export const adapter: OhNetAdapter = (context: OhNetContext): Promise<OhNetResponse> => {
  const { url, method, data: body, headers, signal, timeout } = context.request

  return new Promise<OhNetResponse>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new OhNetAdapterError(
        OHNET_ADAPTER_ERROR_CODE.ABORT,
        OHNET_ADAPTER_ERROR_MESSAGE.ABORT,
      ))
      return
    }

    const task = request({
      url,
      method,
      header: headers.toRecord(),
      timeout,
      data: body,
      success: (res) => {
        resolve({
          status: res.statusCode,
          statusText: res.errMsg,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          headers: OhNetHeader.from(res.header),
          url,
          redirected: false,
          type: "default",
          data: res.data,
        })
      },
      fail: (err) => {
        if (signal?.aborted) {
          reject(new OhNetAdapterError(
            OHNET_ADAPTER_ERROR_CODE.ABORT,
            OHNET_ADAPTER_ERROR_MESSAGE.ABORT,
          ))
        }
        else {
          logger.error(LABEL.lib.request.NETWORK_ERROR, `${method} ${url}: `, err)
          reject(new OhNetAdapterError(
            OHNET_ADAPTER_ERROR_CODE.NETWORK,
            OHNET_ADAPTER_ERROR_MESSAGE.NETWORK,
            err.errMsg,
            err,
          ))
        }
      },
    })

    subscribeAbort(signal, () => task.abort())
  })
}
