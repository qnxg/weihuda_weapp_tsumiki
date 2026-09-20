import type { RequestContext, ResponseMeta } from "@/types/new-request"
import { BaseRequestMiddleware } from "@/types/new-request"

interface ResponseEnvelope {
  code: string
  data: unknown
  msg: string
}

function isEnvelope(data: unknown): data is ResponseEnvelope {
  return (
    typeof data === "object"
    && data !== null
    && "code" in data
    && "data" in data
    && "msg" in data
  )
}

export class UnpackMiddleware extends BaseRequestMiddleware {
  async onSuccess(context: RequestContext, next: () => Promise<void>): Promise<void> {
    const response = context.response as ResponseMeta | undefined
    if (!response) {
      await next()
      return
    }

    const data = response.data
    if (isEnvelope(data) && data.code === "OK") {
      response.data = data.data
    }

    await next()
  }
}
