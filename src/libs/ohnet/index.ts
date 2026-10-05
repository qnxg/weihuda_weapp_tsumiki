import { OhNetBuilder } from "@xtwis/ohnet"
import { ENV } from "@/config/env"
import { adapter } from "./adapter"

/**
 * @description 全局请求实例
 */
export const request = new OhNetBuilder({
  adapter,
  url: ENV.BASE_URL,
})
