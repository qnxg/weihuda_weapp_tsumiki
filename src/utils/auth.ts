import type { AuthRefreshResponse } from "@/apis/models/auth"
import { ENV } from "@/config/env"
import { LABEL } from "@/config/logger-label"
import { STORAGE } from "@/config/storage-key"
import { adapter } from "@/libs/request/adapter"
import { RequestBuilder } from "@/libs/request/builder"
import { ErrorClassifyMiddleware } from "@/libs/request/middleware/error-classify"
import { UnpackMiddleware } from "@/libs/request/middleware/unpack"
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
 * @description 刷新专用请求实例
 */
const refreshRequest = new RequestBuilder({
  adapter,
  url: ENV.BASE_URL,
})
  .with(new UnpackMiddleware())
  .with(new ErrorClassifyMiddleware())

/**
 * @description refresh 单飞锁: 并发 401 只发起一次 /auth/refresh
 * 短生命周期, Promise settle 即复位
 */
let refreshPromise: Promise<string | null> | null = null

/**
 * @description 单飞刷新 token: 用 refresh_token 换取新的 access_token 和 refresh_token, 并一并写入存储
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

      return refreshRequest.post<AuthRefreshResponse>("/auth/refresh", { refresh_token: refreshToken })
        .then(async (res) => {
          const { access_token: accessToken, refresh_token: newRefreshToken } = res
          await Promise.all([
            accessTokenStorage.set(accessToken),
            refreshTokenStorage.set(newRefreshToken),
          ])
          logger.info(LABEL.util.auth, "刷新 token 成功")
          return accessToken
        })
        .catch((error) => {
          logger.error(LABEL.util.auth, "刷新 token 失败: ", error)
          return null
        })
    })().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
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
