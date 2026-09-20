import type { RequestAdapter, RequestContext, RequestMiddlewareNext } from "@/types/new-request"
import { LABEL } from "@/config/logger-label"
import { BaseRequestMiddleware } from "@/types/new-request"
import { BusinessError, ServerError } from "@/types/new-request/error"
import { logger } from "@/utils/logger"

/**
 * @description 服务器与业务错误分类中间件
 */
export class ErrorClassifyMiddleware extends BaseRequestMiddleware {
  async onSuccess(_adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext> {
    const response = context.response

    if (!response) {
      return next(context)
    }

    const { status, text, data } = response

    // 构建错误代码: 处理 data: { code, data, msg } 的 code 字段, status 兜底
    const code = typeof data === "object" && data !== null && "code" in data
      ? String((data as { code: string }).code || status)
      : status

    // 构建错误信息: 处理 data: { code, data, msg } 的 msg 字段, text 兜底
    const msg = typeof data === "object" && data !== null && "msg" in data
      ? String((data as { msg: unknown }).msg || text)
      : text

    // 服务器错误
    if (status >= 500) {
      logger.error(LABEL.lib.request.SERVER_ERROR, `${context.request.method} ${context.request.url}: `, data)
      return next({ ...context, error: new ServerError(status, msg) })
    }

    // 业务错误
    if (status !== 200 || code !== "OK") {
      return next({ ...context, error: new BusinessError(code, msg, data) })
    }

    return next(context)
  }
}
