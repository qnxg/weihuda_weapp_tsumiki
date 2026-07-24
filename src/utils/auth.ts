import type { AuthRefreshResponse, AuthTFAErrorData } from "@/apis/models/auth"
import type { RequestOptions } from "@/libs/request"
import type { RequestError, RequestMethod, Response } from "@/types/request"
import { LABEL } from "@/config/logger-label"
import { STORAGE } from "@/config/storage-key"
import { promptLoginLost, promptTFA } from "@/libs/auth-bridge"
import { request } from "@/libs/request"
import { logger } from "@/utils/logger"
import { Storage } from "@/utils/storage"

/**
 * @description access_token 存储实例
 */
export const accessTokenStorage = new Storage<string>(STORAGE.token.access_token)

/**
 * @description refresh_token 存储实例
 */
export const refreshTokenStorage = new Storage<string>(STORAGE.token.refresh_token)

/**
 * @description refresh 单飞锁: 并发 401 只发起一次 /auth/refresh
 * 短生命周期, Promise settle 即复位
 */
let refreshPromise: Promise<string | null> | null = null

/**
 * @description 单飞刷新 access_token: 用 refresh_token 换取新的 access_token
 * @returns 新的 access_token, 失败 (含 refresh_token 缺失 / 失效) 返回 null
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await refreshTokenStorage.get()
      if (!refreshToken) {
        logger.error(LABEL.util.auth, "刷新失败: 缺少 refresh_token")
        return null
      }

      // 直接使用底层 request (而非 api / auth-request), 避免循环依赖
      return request.post<AuthRefreshResponse>("/auth/refresh", { refresh_token: refreshToken })
        .then(async (res) => {
          const accessToken = res.data.access_token
          await accessTokenStorage.set(accessToken)
          logger.info(LABEL.util.auth, "刷新 access_token 成功")
          return accessToken
        })
        .catch((error) => {
          logger.error(LABEL.util.auth, "刷新 access_token 失败: ", error)
          return null
        })
    })().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

/**
 * @description AUTH_TOKEN_INVALID 处理: 先静默 refresh, 成功则用新 token 透明
 * 重试原请求并返回; 失败则通知 auth-bridge 弹窗引导登录 (会话锁去重), 抛出原错误
 * @template T - 响应数据的类型
 */
export async function handleLoginLost<T extends object | null>(
  error: RequestError,
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T>,
): Promise<Response<T>> {
  const newToken = await refreshAccessToken()
  if (newToken) {
    return request<T>(url, data, method, {
      ...options,
      header: {
        Authorization: `Bearer ${newToken}`,
        ...options.header,
      },
    })
  }

  logger.error(LABEL.util.auth, "刷新失败, 登录已丢失")
  promptLoginLost()
  throw error
}

/**
 * @description 从 401 TFA 错误数据中安全提取手机号, 取不到返回空串
 */
function extractTFAPhone(data: unknown): string {
  if (typeof data === "object" && data !== null && "phone" in data) {
    const { phone } = data as AuthTFAErrorData
    if (typeof phone === "string") {
      return phone
    }
  }
  return ""
}

/**
 * @description TFA 处理: 通知 auth-bridge 弹窗引导前往验证码页 (会话锁去重), 抛出原错误
 */
export function handleTFA(error: RequestError): never {
  logger.error(LABEL.util.auth, "需要进行双因子验证")
  promptTFA(extractTFAPhone(error.data))
  throw error
}

/**
 * @description 清除本地 token (登出 / 登录丢失时使用)
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    accessTokenStorage.remove(),
    refreshTokenStorage.remove(),
  ])
}
