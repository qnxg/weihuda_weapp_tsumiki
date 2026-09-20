/**
 * @description 通用请求错误基类
 * @property {string} type - 错误类型 (NETWORK / SERVER / BUSINESS / ABORT / UNKNOWN)
 * @property {string | number} code - 错误码
 * @property {string} msg - 错误消息
 * @property {unknown} [data] - 业务数据 (如业务错误返回的 data)
 * @property {unknown} [error] - 原始错误对象 (如 Taro fail 的 err)
 */
export class BaseRequestError extends Error {
  type: string
  code: string | number
  msg: string
  data?: unknown
  error?: unknown

  constructor(type: string, code: string | number, msg: string, data?: unknown, error?: unknown) {
    super(`[${code}] ${msg}`)
    this.type = type
    this.code = code
    this.msg = msg
    this.data = data
    this.error = error
  }
}

/**
 * @description 网络错误
 */
export class NetworkError extends BaseRequestError {
  constructor(msg: string, error?: unknown) {
    super("NETWORK", -1, msg, undefined, error)
  }
}

/**
 * @description 服务器错误
 */
export class ServerError extends BaseRequestError {
  constructor(code: string | number, msg: string, error?: unknown) {
    super("SERVER", code, msg, undefined, error)
  }
}

/**
 * @description 业务错误
 */
export class BusinessError extends BaseRequestError {
  constructor(code: string | number, msg: string, data: unknown, error?: unknown) {
    super("BUSINESS", code, msg, data, error)
  }
}

/**
 * @description 主动中断错误
 */
export class AbortError extends BaseRequestError {
  constructor() {
    super("ABORT", -2, "canceled")
  }
}

/**
 * @description 未知错误
 */
export class UnknownError extends BaseRequestError {
  constructor(error?: unknown) {
    super("UNKNOWN", -114514, "unknown", undefined, error)
  }
}
