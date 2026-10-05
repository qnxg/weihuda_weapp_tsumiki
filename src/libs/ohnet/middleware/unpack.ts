import type { OhNetAdapter, OhNetContext } from "@xtwis/ohnet"
import { OhNetMiddleware } from "@xtwis/ohnet"

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
export class UnpackMiddleware extends OhNetMiddleware {
  readonly name = "unpack"

  async leave(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    const response = context.response

    if (!response) {
      return
    }

    const data = response.data as unknown
    if (isEnvelope(data) && data.code === "OK") {
      context.response = { ...response, data: data.data }
    }
  }
}
