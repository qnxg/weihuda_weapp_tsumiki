import type { RequestContext, RequestMiddlewareNext } from "@/types/new-request"
import { BaseRequestMiddleware } from "@/types/new-request"
import { BusinessError, ServerError } from "@/types/new-request/error"

export class ErrorClassifyMiddleware extends BaseRequestMiddleware {
  async onSuccess(context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext> {
    const response = context.response

    if (!response) {
      return next(context)
    }

    const { status, text, data } = response

    const code = typeof data === "object" && data !== null && "code" in data
      ? String((data as { code: string }).code || status)
      : status

    const msg = typeof data === "object" && data !== null && "msg" in data
      ? String((data as { msg: unknown }).msg || text)
      : text

    if (status >= 500) {
      return next({ ...context, error: new ServerError(status, msg) })
    }

    if (status !== 200 || code !== "OK") {
      return next({ ...context, error: new BusinessError(code, msg, data) })
    }

    return next(context)
  }
}
