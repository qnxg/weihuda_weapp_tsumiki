import Taro from "@tarojs/taro"
import { ENV } from "@/utils/env"

/**
 * @interface Response - 通用响应
 * @template T - 响应数据的类型
 * @property {number} code - 响应状态码
 * @property {T} data - 响应数据
 * @property {string} msg - 响应消息
 */
export interface Response<T> {
  code: number
  data: T
  msg: string
}

/**
 * @class RequestError - 请求错误类
 * @template T - 响应数据的类型
 * @property {number} statusCode - HTTP 状态码
 * @property {Response<T>} data - 错误响应
 */
export class RequestError<T> extends Error {
  statusCode: number
  data: Response<T>

  constructor(statusCode: number, data: Response<T>) {
    super(data.msg)
    this.statusCode = statusCode
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

  const res = await Taro.request({
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

  if (res.statusCode !== 200) {
    throw new RequestError<T>(res.statusCode, res.data as Response<T>)
  }

  return res.data as Response<T>
}

request.get = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "GET", options)

request.post = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "POST", options)

request.put = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "PUT", options)

request.delete = <T = null>(url: string, data?: unknown, options: RequestOptions = {}) =>
  request<T>(url, data, "DELETE", options)
