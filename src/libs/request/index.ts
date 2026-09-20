import { ENV } from "@/config/env"
import { adapter } from "@/libs/request/adapter"
import { RequestBuilder } from "@/libs/request/builder"
import { AuthMiddleware } from "@/libs/request/middleware/auth"
import { ErrorClassifyMiddleware } from "@/libs/request/middleware/error-classify"
import { UnpackMiddleware } from "@/libs/request/middleware/unpack"

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
