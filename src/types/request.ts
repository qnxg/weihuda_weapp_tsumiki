/**
 * @description 通用响应
 * @template T - 响应数据的类型
 * @property {string} code - 响应代码
 * @property {T} data - 响应数据
 */
export interface Response<T extends object | null> {
  code: string
  data: T
}

/**
 * @description 请求错误类
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
 * @description 请求配置
 * @property {string} url - 请求 URL
 * @property {unknown} data - 请求数据
 * @property {RequestMethod} method - HTTP 请求方法
 * @property {Header} header - 请求头
 */
export interface RequestConfig {
  url: string
  data: unknown
  method: RequestMethod
  header: Header
}
