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

export class RequestBuilder {
  adapter: RequestAdapter | null = null
  context: RequestContext = { ...DEFAULT_REQUEST_CONTEXT }
  middlewares: BaseRequestMiddleware[] = []

  constructor(config: RequestConfig) {
    this.adapter = config.adapter ?? null
    this.applyConfig(config)
  }

  fork(config: RequestConfig): RequestBuilder {
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

  add(config: RequestConfig): RequestBuilder {
    return this.fork(config)
  }

  with(middleware: BaseRequestMiddleware): RequestBuilder {
    const child = new RequestBuilder({})
    child.adapter = this.adapter
    child.context = {
      ...this.context,
      request: { ...this.context.request },
      meta: {},
    }
    child.middlewares = [...this.middlewares, middleware]
    return child
  }

  append(path: string): RequestBuilder {
    const child = new RequestBuilder({})
    child.adapter = this.adapter
    child.context = {
      ...this.context,
      request: { ...this.context.request, url: this.context.request.url + path },
      meta: {},
    }
    child.middlewares = [...this.middlewares]
    return child
  }

  async run<T>(): Promise<T> {
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

  async request<T>(config: RequestConfig): Promise<T> {
    return this.fork(config).run<T>()
  }

  get<T>(path?: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "GET", url: path, body: data })
  }

  post<T>(path?: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "POST", url: path, body: data })
  }

  put<T>(path?: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "PUT", url: path, body: data })
  }

  delete<T>(path?: string, data?: unknown): Promise<T> {
    return this.request<T>({ method: "DELETE", url: path, body: data })
  }

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
}
