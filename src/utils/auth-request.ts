import type { RequestMethod, RequestOptions, Response } from "./request"
import { request } from "./request"

const getToken = () => "token-placeholder"

/**
 * @function authRequest - 自动携带鉴权的请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL
 * @param data - 请求数据
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions<T>} [options] - 请求配置项
 */
export async function authRequest<T extends object | null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T> = {},
): Promise<Response<T>> {
  const { onBusinessError, ...restOptions } = options

  return request<T>(url, data, method, {
    ...restOptions,
    header: {
      Authorization: `Bearer ${getToken()}`,
      ...restOptions.header,
    },
    onBusinessError: (url, data, method, header, error) => {
      if (error.statusCode === 401) {
        switch (error.code) {
          case "AUTH_TOKEN_EXPIRED":
            console.error("[AuthRequest] Token 已过期.")
            break
          case "AUTH_TOKEN_NOT_FOUND":
            console.error("[AuthRequest] Token 不存在.")
            break
          case "AUTH_TOKEN_INVALID":
            console.error("[AuthRequest] Token 无效.")
            break
          case "TFA":
            console.error("[AuthRequest] 需要进行双因子验证.")
            break
          case "CAS":
            console.error("[AuthRequest] 需要重新绑定 CAS.")
            break
          default:
            console.error("[AuthRequest] 鉴权失败:", error)
        }
      }
      onBusinessError?.(url, data, method, header, error)
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
