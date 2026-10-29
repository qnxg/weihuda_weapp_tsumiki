import { OhNetClient } from "@xtwis/ohnet"
import { ENV } from "@/config/env"
import { adapter } from "@/libs/request/adapter"
import { AuthMiddleware } from "@/libs/request/middleware/auth"
import { ErrorClassifyMiddleware } from "@/libs/request/middleware/error-classify"
import { UnpackMiddleware } from "@/libs/request/middleware/unpack"

/**
 * @description 放宽 ohnet 严格类型的请求客户端, 让 `get(path, params)` 的 `params` 接受 `unknown`
 * 兼容业务侧 `Request` interface (无索引签名), 不强制转换为 `Record<string, unknown>`
 */
type RequestClient = Omit<OhNetClient, "get"> & {
  get: <T>(path?: string, params?: unknown, data?: unknown) => Promise<T>
}

const client = OhNetClient.create({
  adapter,
  url: ENV.BASE_URL,
})
  .with(new AuthMiddleware())
  .with(new UnpackMiddleware())
  .with(new ErrorClassifyMiddleware())

/**
 * @description 全局请求实例
 */
export const request = client as unknown as RequestClient
