import { OhNetBuilder } from "@xtwis/ohnet"
import { ENV } from "@/config/env"
import { adapter } from "@/libs/ohnet/adapter"
import { ErrorClassifyMiddleware } from "@/libs/ohnet/middleware/error-classify"
import { UnpackMiddleware } from "@/libs/ohnet/middleware/unpack"

/**
 * @description 全局请求实例
 */
export const request = new OhNetBuilder({
  adapter,
  url: ENV.BASE_URL,
})
  .with(new UnpackMiddleware())
  .with(new ErrorClassifyMiddleware())
