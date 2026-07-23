import type { RequestOptions } from "@/libs/request"
import type { RequestMethod, Response } from "@/types/request"
import { LABEL } from "@/config/logger-label"
import { request } from "@/libs/request"
import { accessTokenStorage, handleLoginLost, handleTFA } from "@/utils/auth"
import { logger } from "@/utils/logger"

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

  const token = await accessTokenStorage.get()
  if (!token) {
    logger.warn(LABEL.util.auth_request, "未找到 token.")
  }

  return request<T>(url, data, method, {
    ...restOptions,
    header: {
      Authorization: `Bearer ${token ?? ""}`,
      ...restOptions.header,
    },
    businessErrorInterceptor: async (config, error) => {
      if (error.statusCode === 401) {
        switch (error.code) {
          case "AUTH_TOKEN_INVALID":
            return handleLoginLost<T>(error, url, data, method, restOptions)
          case "TFA":
            return handleTFA(error)
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
