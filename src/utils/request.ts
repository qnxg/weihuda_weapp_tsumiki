import Taro from "@tarojs/taro"
import { ENV } from "@/utils/env"

/**
 * @interface Response - 通用响应
 * @template T - 响应数据的类型
 * @property {string} code - 响应代码
 * @property {T} data - 响应数据
 */
export interface Response<T> {
  code: string
  data: T
}

/**
 * @class RequestError - 请求错误类
 * @template T - 响应数据的类型
 * @param {number} statusCode - HTTP 状态码
 * @param {string} code - 错误响应代码
 * @param {T} data - 错误响应数据
 * @property {number} statusCode - HTTP 状态码
 * @property {string} code - 错误响应代码
 * @property {T} data - 错误响应数据
 */
export class RequestError<T> extends Error {
  statusCode: number
  code: string
  data: T

  constructor(statusCode: number, code: string, data: T) {
    super(code)
    this.statusCode = statusCode
    this.code = code
    this.data = data
  }
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

/**
 * @interface RequestOptions - 通用请求函数配置项
 * @property {boolean} [withToken=true] - 是否携带 token, 默认为 true
 * @property {Record<string, string>} [header] - 额外的请求头
 * @property {number} [timeout] - 请求超时时间, 单位为毫秒
 */
export interface RequestOptions {
  withToken?: boolean
  header?: Record<string, string>
  timeout?: number
}

const BASE_URL = ENV.BASE_URL

const getToken = () => "placeholder"

/**
 * @function request - 通用请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL, 会自动拼接 BASE_URL
 * @param data - 请求数据 (对于 GET 请求会被转换为查询参数)
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions} options - 请求配置项
 */
export async function request<T = null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions = {},
): Promise<Response<T>> {
  const { withToken = true, header = {}, timeout } = options

  const authHeader = withToken ? { Authorization: getToken() } : {}

  let res: Taro.request.SuccessCallbackResult
  try {
    res = await Taro.request({
      url: BASE_URL + url,
      data,
      method,
      header: {
        "Content-Type": "application/json",
        ...authHeader,
        ...header,
      },
      timeout,
    })
  }
  catch (err) {
    // 请求发送错误 (超时等)
    console.error(`[Network Error] ${method} ${url} :`, err)
    throw new RequestError<T>(-1, "NETWORK_ERROR", {} as T)
  }

  // 服务器错误 (5xx)
  if (res.statusCode >= 500) {
    console.error(`[Server Error ${res.statusCode}] ${method} ${url} :`, res.data)
    throw new RequestError<T>(res.statusCode, "SERVER_ERROR", {} as T)
  }

  const response = res.data as Response<T>

  // 其他非 200 错误 (业务错误)
  if (res.statusCode !== 200) {
    throw new RequestError<T>(res.statusCode, response.code, response.data)
  }

  return response
}

request.get = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "GET", options)

request.post = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "POST", options)

request.put = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "PUT", options)

request.delete = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "DELETE", options)
