import type { OhNetAdapter, OhNetContext, OhNetMiddlewareLeaveControls } from "@xtwis/ohnet"
import { OhNetMiddleware } from "@xtwis/ohnet"
import { LABEL } from "@/config/logger-label"
import { promptLoginLost, promptTFA } from "@/libs/auth-bridge"
import { BusinessError } from "@/types/ohnet/error"
import { accessTokenStorage, refreshAccessToken } from "@/utils/auth"
import { logger } from "@/utils/logger"

function extractTFAPhone(data: unknown): string {
  if (typeof data === "object" && data !== null && "phone" in data) {
    const { phone } = data as { phone: string }
    if (typeof phone === "string") {
      return phone
    }
  }
  return ""
}

/**
 * @description 自动鉴权中间件
 */
export class AuthMiddleware extends OhNetMiddleware {
  readonly name = "auth"

  async enter(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    const token = await accessTokenStorage.get()
    if (!token) {
      logger.warn(LABEL.util.auth_request, "未找到 token.")
    }

    // 自动携带鉴权头
    context.request.headers.set("Authorization", `Bearer ${token ?? ""}`)
  }

  async leave(_adapter: OhNetAdapter, context: OhNetContext, controls: OhNetMiddlewareLeaveControls): Promise<void> {
    const error = context.error
    if (!(error instanceof BusinessError)) {
      return
    }

    if (error.code === "AUTH_TOKEN_INVALID") {
      // 自动重试
      const newToken = await refreshAccessToken()
      if (newToken) {
        controls.retry()
        return
      }
      promptLoginLost()
    }
    else if (error.code === "TFA") {
      promptTFA(extractTFAPhone(error.data))
    }
  }
}
