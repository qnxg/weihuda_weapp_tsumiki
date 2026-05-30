import type { RequestOptions } from "@/libs/request"
import type { RequestMethod, Response } from "@/types/request"
import { LABEL } from "@/config/logger-label"
import { STORAGE } from "@/config/storage-key"
import { request } from "@/libs/request"
import { RequestError } from "@/types/request"
import { logger } from "@/utils/logger"
import { Storage } from "@/utils/storage"

/**
 * @description token 存储实例
 */
export const tokenStorage = new Storage<string>(STORAGE.token.access_token)

/**
 * @description 自动携带鉴权头并处理鉴权错误的请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL
 * @param {unknown} data - 请求数据
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions} [options] - 请求配置项
 */
async function authRequest<T extends object | null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T> = {},
): Promise<Response<T>> {
  const { businessErrorInterceptor, ...restOptions } = options

  const token = await tokenStorage.get()
  if (!token) {
    logger.warn(LABEL.util.auth_request, "未找到 token.")
  }

  return request<T>(url, data, method, {
    ...restOptions,
    header: {
      Authorization: `Bearer ${token ?? ""}`,
      ...restOptions.header,
    },
    businessErrorInterceptor: (config, error) => {
      if (error.statusCode === 401) {
        switch (error.code) {
          case "AUTH_TOKEN_INVALID":
            logger.error(LABEL.util.auth_request, "Token 无效.")
            return new RequestError(0, "AUTH_TOKEN_INVALID", "Token 无效.")
          case "TFA":
            logger.error(LABEL.util.auth_request, "需要进行双因子验证.")
            return new RequestError(0, "TFA", "需要进行双因子验证.")
        }
      }
      return businessErrorInterceptor?.(config, error)
    },
  })
}

authRequest.get = <T extends object | null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  authRequest<T>(url, data, "GET", options)

authRequest.post = <T extends object | null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  authRequest<T>(url, data, "POST", options)

authRequest.put = <T extends object | null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  authRequest<T>(url, data, "PUT", options)

authRequest.delete = <T extends object | null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  authRequest<T>(url, data, "DELETE", options)

export { authRequest as request }
