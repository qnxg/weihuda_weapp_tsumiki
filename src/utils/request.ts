import Taro from "@tarojs/taro"
import { ENV } from "@/utils/env"

/**
 * @interface Response - 通用响应
 * @template T - 响应数据的类型
 * @property {string} code - 响应代码
 * @property {T} data - 响应数据
 */
export interface Response<T extends object | null> {
  code: string
  data: T
}

/**
 * @class RequestError - 请求错误类
 * @param {number} statusCode - HTTP 状态码
 * @param {string} code - 错误响应代码
 * @param {unknown} data - 错误响应数据
 * @property {number} statusCode - HTTP 状态码
 * @property {string} code - 错误响应代码
 * @property {unknown} data - 错误响应数据
 */
export class RequestError extends Error {
  statusCode: number
  code: string
  data: unknown

  constructor(statusCode: number, code: string, data: unknown) {
    super(code)
    this.statusCode = statusCode
    this.code = code
    this.data = data
  }
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"
export type Header = Record<string, string>

/**
 * @interface RequestOptions - 通用请求函数配置项
 * @template T - 响应数据的类型
 * @property {Header} [header] - 额外的请求头
 * @property {number} [timeout] - 请求超时时间, 单位为毫秒
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header) => void) | null} [onFetch=null] - 请求发送前回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, err: any) => void) | null} [onError=null] - 请求错误回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, err: any) => void) | null} [onNetworkError=null] - 网络错误回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, error: unknown) => void) | null} [onServerError=null] - 服务器错误回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, error: RequestError) => void) | null} [onBusinessError=null] - 业务错误回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, response: T) => void) | null} [onSuccess=null] - 请求成功回调
 * @property {((url: string, data: unknown, method: RequestMethod, header: Header, response: T | null, err: any) => void) | null} [onSettled=null] - 请求结束回调
 */
export interface RequestOptions<T> {
  header?: Header
  timeout?: number
  onFetch?: ((url: string, data: unknown, method: RequestMethod, header: Header) => void) | null
  onError?: ((url: string, data: unknown, method: RequestMethod, header: Header, err: any) => void) | null
  onNetworkError?: ((url: string, data: unknown, method: RequestMethod, header: Header, err: any) => void) | null
  onServerError?: ((url: string, data: unknown, method: RequestMethod, header: Header, error: unknown) => void) | null
  onBusinessError?: ((url: string, data: unknown, method: RequestMethod, header: Header, error: RequestError) => void) | null
  onSuccess?: ((url: string, data: unknown, method: RequestMethod, header: Header, response: T) => void) | null
  onSettled?: ((url: string, data: unknown, method: RequestMethod, header: Header, response: T | null, err: any) => void) | null
}

const BASE_URL = ENV.BASE_URL

/**
 * @function request - 通用请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL, 会自动拼接 BASE_URL
 * @param data - 请求数据 (对于 GET 请求会被转换为查询参数)
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions} options - 请求配置项
 */
export async function request<T extends object | null = null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T> = {},
): Promise<Response<T>> {
  const {
    header = {},
    timeout,
    onFetch = null,
    onError = null,
    onNetworkError = null,
    onServerError = null,
    onBusinessError = null,
    onSuccess = null,
    onSettled = null,
  } = options

  const mergedHeader: Header = {
    "Content-Type": "application/json",
    ...header,
  }

  onFetch?.(url, data, method, mergedHeader)

  let res: Taro.request.SuccessCallbackResult
  try {
    res = await Taro.request({
      url: BASE_URL + url,
      data,
      method,
      header: mergedHeader,
      timeout,
    })
  }
  catch (err) {
    // 请求发送错误 (超时等)
    console.error(`[Network Error] ${method} ${url} :`, err)
    onNetworkError?.(url, data, method, mergedHeader, err)
    onError?.(url, data, method, mergedHeader, err)
    onSettled?.(url, data, method, mergedHeader, null, err)
    throw new RequestError(-1, "NETWORK_ERROR", null)
  }

  // 服务器错误 (5xx)
  if (res.statusCode >= 500) {
    console.error(`[Server Error ${res.statusCode}] ${method} ${url} :`, res.data)
    onServerError?.(url, data, method, mergedHeader, res.data)
    onError?.(url, data, method, mergedHeader, res.data)
    onSettled?.(url, data, method, mergedHeader, null, res.data)
    throw new RequestError(res.statusCode, "SERVER_ERROR", null)
  }

  const response = res.data as Response<T>

  // 其他非 200 错误 (业务错误)
  if (res.statusCode !== 200) {
    const error = new RequestError(res.statusCode, response.code, response.data)
    onBusinessError?.(url, data, method, mergedHeader, error)
    onError?.(url, data, method, mergedHeader, error)
    onSettled?.(url, data, method, mergedHeader, null, error)
    throw error
  }

  onSuccess?.(url, data, method, mergedHeader, response.data)
  onSettled?.(url, data, method, mergedHeader, response.data, null)
  return response
}

request.get = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "GET", options)

request.post = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "POST", options)

request.put = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "PUT", options)

request.delete = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "DELETE", options)
