import type {
  RequestAdapter,
  RequestContext,
  RequestMiddlewareNext,
  ResponseMeta,
} from "@/types/request"
import { LABEL } from "@/config/logger-label"
import { promptLoginLost, promptTFA } from "@/libs/auth-bridge"
import { RequestBuilder } from "@/libs/request/builder"
import { BaseRequestMiddleware } from "@/types/request"
import { BusinessError } from "@/types/request/error"
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
export class AuthMiddleware extends BaseRequestMiddleware {
  async onStart(_adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext> {
    const token = await accessTokenStorage.get()
    if (!token) {
      logger.warn(LABEL.util.auth_request, "未找到 token.")
    }

    // 自动携带鉴权头
    return next({
      ...context,
      request: {
        ...context.request,
        headers: {
          ...context.request.headers,
          Authorization: `Bearer ${token ?? ""}`,
        },
      },
    })
  }

  async onError(adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext> {
    const error = context.error
    if (!(error instanceof BusinessError)) {
      return next(context)
    }

    if (error.code === "AUTH_TOKEN_INVALID") {
      // 自动重试
      const newToken = await refreshAccessToken()
      if (newToken) {
        try {
          const data = await new RequestBuilder({
            adapter,
            ...context.request,
            headers: {
              ...context.request.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }).request()
          const response: ResponseMeta = { status: 200, text: "", headers: {}, data }
          return next({ ...context, response, error: null })
        }
        catch {
          return next(context)
        }
      }
      promptLoginLost()
    }
    else if (error.code === "TFA") {
      promptTFA(extractTFAPhone(error.data))
    }

    return next(context)
  }
}
