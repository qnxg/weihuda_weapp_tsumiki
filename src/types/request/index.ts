import type { BaseRequestError } from "@/types/request/error"

/**
 * @description 请求方法
 */
export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

/**
 * @description 请求头
 */
export type RequestHeader = Record<string, string>

/**
 * @description 请求中断控制信号
 * @property {boolean} aborted - 是否已中断
 * @property {(() => void) | undefined} [onAbort] - 中断回调
 */
export interface RequestSignal {
  aborted: boolean
  onAbort?: () => void
}

/**
 * @description 通用请求元数据
 * @property {string} url - 请求 URL
 * @property {RequestMethod} method - 请求方法
 * @property {RequestHeader} headers - 请求头
 * @property {unknown} [body] - 请求体
 * @property {RequestSignal} signal - 中断信号
 * @property {number} [timeout] - 超时时间
 */
export interface RequestMeta {
  url: string
  method: RequestMethod
  headers: RequestHeader
  body?: unknown
  signal: RequestSignal
  timeout?: number
}

/**
 * @description 通用响应元数据
 * @property {number} status - HTTP 状态码
 * @property {string} text - 状态文本
 * @property {RequestHeader} headers - 响应头
 * @property {unknown} data - 响应数据
 */
export interface ResponseMeta {
  status: number
  text: string
  headers: RequestHeader
  data: unknown
}

/**
 * @description 通用请求上下文
 * @property {RequestMeta} request - 请求元数据
 * @property {ResponseMeta | null} response - 响应元数据
 * @property {BaseRequestError | null} error - 请求错误
 * @property {Record<string | symbol, unknown>} meta - 中间件间传递的私有状态
 */
export interface RequestContext {
  request: RequestMeta
  response: ResponseMeta | null
  error: BaseRequestError | null
  meta: Record<string | symbol, unknown>
}

/**
 * @description 请求适配器函数
 */
export type RequestAdapter = (context: RequestContext) => Promise<ResponseMeta>

/**
 * @description 通用请求配置项
 */
export type RequestConfig = Partial<RequestMeta> & {
  adapter?: RequestAdapter
}

/**
 * @description 中间件 next 函数
 * @param {RequestContext} context - 请求上下文
 * @return {Promise<RequestContext>} 处理后的上下文
 */
export type RequestMiddlewareNext = (context: RequestContext) => Promise<RequestContext>

/**
 * @description 通用请求中间件基类
 */
export abstract class BaseRequestMiddleware {
  /**
   * @description 请求阶段中间件进入回调
   * @param {RequestAdapter} adapter - 请求适配器
   * @param {RequestContext} context - 请求上下文
   * @param {RequestContext} next - 中间件 next 函数
   * @return {Promise<RequestContext>} 处理后的上下文
   */
  async onStart?(adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext>
  /**
   * @description 响应成功时回调
   * @param {RequestAdapter} adapter - 请求适配器
   * @param {RequestContext} context - 请求上下文
   * @param {RequestContext} next - 中间件 next 函数
   * @return {Promise<RequestContext>} 处理后的上下文
   */
  async onSuccess?(adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext>
  /**
   * @description 响应失败时回调
   * @param {RequestAdapter} adapter - 请求适配器
   * @param {RequestContext} context - 请求上下文
   * @param {RequestContext} next - 中间件 next 函数
   * @return {Promise<RequestContext>} 处理后的上下文
   */
  async onError?(adapter: RequestAdapter, context: RequestContext, next: RequestMiddlewareNext): Promise<RequestContext>
}
