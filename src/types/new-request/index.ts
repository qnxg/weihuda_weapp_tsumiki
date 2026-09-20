import type { BaseRequestError } from "@/types/new-request/error"

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
 */
export interface RequestSignal {
  aborted: boolean
  onAbort?: () => void
}

/**
 * @description 请求中断控制器
 */
export interface RequestController {
  signal: RequestSignal
  abort: () => void
}

/**
 * @description 通用请求元数据
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
 */
export interface ResponseMeta<T = unknown> {
  status: number
  text: string
  headers: RequestHeader
  data: T
}

/**
 * @description 通用请求上下文
 */
export interface RequestContext {
  request: RequestMeta
  response?: ResponseMeta
  error?: BaseRequestError
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
 * @description 通用请求中间件基类
 */
export abstract class BaseRequestMiddleware {
  async onStart?(context: RequestContext, next: () => Promise<void>): Promise<void>
  async onSuccess?(context: RequestContext, next: () => Promise<void>): Promise<void>
  async onError?(context: RequestContext, next: () => Promise<void>): Promise<void>
}
