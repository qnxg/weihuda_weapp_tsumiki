import type { RequestContext } from "@/types/new-request"
import { BaseRequestMiddleware } from "@/types/new-request"
import { BusinessError, ServerError } from "@/types/new-request/error"

export class ErrorClassifyMiddleware extends BaseRequestMiddleware {
  async onSuccess(context: RequestContext, next: () => Promise<void>): Promise<void> {
    const response = context.response

    if (!response) {
      return
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

    // 5xx 服务器错误
    if (status >= 500) {
      context.error = new ServerError(status, msg)
    }

    // 其他非 200 错误及 200 的业务错误 (业务错误)
    if (status !== 200 || code !== "OK") {
      context.error = new BusinessError(code, msg, data)
    }

    await next()
  }
}
