import type {
  BaseRequestMiddleware,
  RequestAdapter,
  RequestConfig,
  RequestContext,
} from "@/types/new-request"
import { UnknownError } from "@/types/new-request/error"
import { pipeline } from "./pipeline"

const DEFAULT_REQUEST_CONTEXT: RequestContext = {
  request: {
    url: "",
    method: "GET",
    headers: {},
    signal: { aborted: false },
  },
  response: null,
  error: null,
  meta: {},
}

/**
 * @description 通用请求类构造器
 * @param {RequestConfig} config - 请求配置
 * @property {RequestAdapter | null} adapter - 请求适配器
 * @property {RequestContext} context - 请求上下文
 * @property {BaseRequestMiddleware[]} middlewares - 请求中间件
 */
export class RequestBuilder {
  adapter: RequestAdapter | null = null
  context: RequestContext = {
    ...DEFAULT_REQUEST_CONTEXT,
    request: { ...DEFAULT_REQUEST_CONTEXT.request },
  }

  middlewares: BaseRequestMiddleware[] = []

  constructor(config: RequestConfig) {
    this.adapter = config.adapter ?? null
    this.applyConfig(config)
  }

  /**
   * @description fork 新实例
   * @param {RequestConfig} config - 插入配置
   */
  fork(config: RequestConfig = {}): RequestBuilder {
    const child = new RequestBuilder({})
    child.adapter = this.adapter
    child.context = {
      ...this.context,
      request: { ...this.context.request },
      meta: {},
    }
    child.middlewares = [...this.middlewares]

    child.applyConfig(config)
    return child
  }

  /**
   * @description 添加配置项
   * @param {RequestConfig} config - 插入配置
   */
  add(config: RequestConfig): RequestBuilder {
    return this.fork(config)
  }

  /**
   * @description 注册中间件
   * @param {BaseRequestMiddleware} middleware - 中间件实例
   */
  with(middleware: BaseRequestMiddleware): RequestBuilder {
    const child = this.fork()
    child.middlewares = [...child.middlewares, middleware]
    return child
  }

  /**
   * @description 追加路径到当前 URL
   * @param {string} path - 追加的路径
   */
  append(path: string): RequestBuilder {
    return this.fork({ url: this.context.request.url + path })
  }

  /**
   * @description 执行请求和中间件管线
   * @template T - 响应数据类型
   * @param {RequestConfig} config - 插入配置
   * @returns {Promise<T>} 响应数据
   */
  async request<T>(config: RequestConfig = {}): Promise<T> {
    return this.fork(config).run<T>()
  }

  /**
   * @description 发起 GET 请求
   * @template T - 响应数据类型
   * @param {string} [path] - 追加的路径
   * @param {unknown} [data] - 请求数据
   * @returns {Promise<T>} 响应数据
   */
  get<T>(path?: string, data?: unknown): Promise<T> {
    return this.append(path ?? "").request<T>({ method: "GET", body: data })
  }

  /**
   * @description 发起 POST 请求
   * @template T - 响应数据类型
   * @param {string} [path] - 追加的路径
   * @param {unknown} [data] - 请求数据
   * @returns {Promise<T>} 响应数据
   */
  post<T>(path?: string, data?: unknown): Promise<T> {
    return this.append(path ?? "").request<T>({ method: "POST", body: data })
  }

  /**
   * @description 发起 PUT 请求
   * @template T - 响应数据类型
   * @param {string} [path] - 追加的路径
   * @param {unknown} [data] - 请求数据
   * @returns {Promise<T>} 响应数据
   */
  put<T>(path?: string, data?: unknown): Promise<T> {
    return this.append(path ?? "").request<T>({ method: "PUT", body: data })
  }

  /**
   * @description 发起 DELETE 请求
   * @template T - 响应数据类型
   * @param {string} [path] - 追加的路径
   * @param {unknown} [data] - 请求数据
   * @returns {Promise<T>} 响应数据
   */
  delete<T>(path?: string, data?: unknown): Promise<T> {
    return this.append(path ?? "").request<T>({ method: "DELETE", body: data })
  }

  /**
   * @description 应用配置到当前 context
   * @param {RequestConfig} config - 配置项
   */
  private applyConfig(config: RequestConfig): void {
    const { url, method, headers, body, signal, timeout } = config
    if (url !== undefined)
      this.context.request.url = url
    if (method !== undefined)
      this.context.request.method = method
    if (headers !== undefined)
      this.context.request.headers = { ...this.context.request.headers, ...headers }
    if (body !== undefined)
      this.context.request.body = body
    if (signal !== undefined)
      this.context.request.signal = signal
    if (timeout !== undefined)
      this.context.request.timeout = timeout
  }

  /**
   * @description 执行当前实例的请求和中间件管线
   * @template T - 响应数据类型
   * @returns {Promise<T>} 响应数据
   */
  private async run<T>(): Promise<T> {
    if (!this.adapter) {
      throw new Error("No adapter configured")
    }
    const ctx = await pipeline(this.context, this.middlewares, this.adapter)
    if (ctx.error) {
      throw ctx.error
    }
    if (!ctx.response) {
      throw new UnknownError()
    }
    return ctx.response.data as T
  }
}
