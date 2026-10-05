import type { OhNetMiddleware, OhNetParams } from "@xtwis/ohnet"
import { OhNetBuilder } from "@xtwis/ohnet"
import { ENV } from "@/config/env"
import { adapter } from "@/libs/request/adapter"
import { AuthMiddleware } from "@/libs/request/middleware/auth"
import { ErrorClassifyMiddleware } from "@/libs/request/middleware/error-classify"
import { UnpackMiddleware } from "@/libs/request/middleware/unpack"

/**
 * @description 放宽 ohnet 严格类型的请求构造器, 让 `get(path, params)` 的 `params` 接受 `unknown`
 * 兼容业务侧 `Request` interface (无索引签名), 不强制转换为 `Record<string, unknown>`
 */
class RequestBuilder extends OhNetBuilder {
  override with(middleware: OhNetMiddleware): this {
    return super.with(middleware) as this
  }

  override get<T>(path?: string, params?: unknown, data?: unknown): Promise<T> {
    return super.get<T>(path, params as OhNetParams, data)
  }
}

/**
 * @description 全局请求实例
 */
export const request = new RequestBuilder({
  adapter,
  url: ENV.BASE_URL,
})
  .with(new AuthMiddleware())
  .with(new UnpackMiddleware())
  .with(new ErrorClassifyMiddleware())
