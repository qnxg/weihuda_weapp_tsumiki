import type { RequestAdapter, RequestContext, RequestMiddlewareNext, ResponseMeta } from "@/types/request"
import { BaseRequestMiddleware } from "@/types/request"

interface ResponseEnvelope {
  code: string
  data: unknown
  msg?: string
}

function isEnvelope(data: unknown): data is ResponseEnvelope {
  return (
    typeof data === "object"
    && data !== null
    && "code" in data
    && "data" in data
  )
}

/**
 * @description 响应解包中间件
 */
export class UnpackMiddleware extends BaseRequestMiddleware {
  async onSuccess(_adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext> {
    const response = context.response

    if (!response) {
      return next(context)
    }

    const data = response.data as unknown
    if (isEnvelope(data) && data.code === "OK") {
      const newResponse: ResponseMeta = { ...response, data: data.data }
      return next({ ...context, response: newResponse })
    }

    return next(context)
  }
}
