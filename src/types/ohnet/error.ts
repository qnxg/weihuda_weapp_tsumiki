import { OhNetError } from "@xtwis/ohnet"

/**
 * @description 业务错误, 由 ErrorClassifyMiddleware 在 HTTP 状态码非 2xx, 或响应信封 `code` 非 `"OK"` 时抛出
 * @property {string | number} code - 错误码, 业务侧与后端约定 (如 `"AUTH_TOKEN_INVALID"`, `"TFA"`, 业务自定义码等)
 * @property {string} message - 错误消息, 优先取 `data.msg`, 兜底 `response.statusText`
 * @property {unknown} data - 响应信封的 `data` 字段 (如 TFA 引导下发的 phone), 业务侧按需读取
 */
export class BusinessError extends OhNetError {
  constructor(code: string | number, message: string, data: unknown) {
    super("BUSINESS", String(code), message, data)
  }
}

/**
 * @description 服务器错误, 由 ErrorClassifyMiddleware 在 HTTP 状态码 >= 500 时抛出
 * @property {string | number} code - HTTP 状态码
 * @property {string} message - 错误消息, 优先取 `data.msg`, 兜底 `response.statusText`
 */
export class ServerError extends OhNetError {
  constructor(code: string | number, message: string) {
    super("SERVER", String(code), message)
  }
}
