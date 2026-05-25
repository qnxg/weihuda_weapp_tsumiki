import type { RequestMethod, RequestOptions, Response } from "@/libs/request"
import { request, RequestError } from "@/libs/request"
import { MyStorage } from "@/libs/storage"

/**
 * @description token 存储实例
 */
export const tokenStorage = new MyStorage<string>("token")

/**
 * @description 自动携带鉴权头并处理鉴权错误的请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL
 * @param {unknown} data - 请求数据
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions} [options] - 请求配置项
 */
export async function authRequest<T extends object | null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T> = {},
): Promise<Response<T>> {
  const { businessErrorInterceptor, ...restOptions } = options

  const token = await tokenStorage.get()
  if (!token) {
    console.warn("[AuthRequest] 未找到 token.")
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
            console.error("[AuthRequest] Token 无效.")
            return new RequestError(0, "AUTH_TOKEN_INVALID", "Token 无效.")
          case "TFA":
            console.error("[AuthRequest] 需要进行双因子验证.")
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
