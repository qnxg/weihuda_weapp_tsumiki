import type { OhNetAdapter, OhNetContext } from "@xtwis/ohnet"
import { OhNetMiddleware } from "@xtwis/ohnet"
import { LABEL } from "@/config/logger-label"
import { BusinessError, ServerError } from "@/types/request/error"
import { logger } from "@/utils/logger"

/**
 * @description 服务器与业务错误分类中间件
 */
export class ErrorClassifyMiddleware extends OhNetMiddleware {
  readonly name = "error-classify"

  async leave(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    const response = context.response

    if (!response) {
      return
    }

    const { status, statusText, data } = response

    // 构建错误代码: 处理 data: { code, data, msg } 的 code 字段, status 兜底
    const code = typeof data === "object" && data !== null && "code" in data
      ? String((data as { code: string }).code || status)
      : status

    // 构建错误信息: 处理 data: { code, data, msg } 的 msg 字段, text 兜底
    const msg = typeof data === "object" && data !== null && "msg" in data
      ? String((data as { msg: unknown }).msg || statusText)
      : statusText

    // 服务器错误
    if (status >= 500) {
      logger.error(LABEL.lib.request.SERVER_ERROR, `${context.request.method} ${context.request.url}: `, data)
      throw new ServerError(status, msg)
    }

    // 业务错误
    if (status !== 200 || code !== "OK") {
      throw new BusinessError(code, msg, data)
    }
  }
}
