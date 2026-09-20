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
  context: RequestContext = DEFAULT_REQUEST_CONTEXT
  middlewares: BaseRequestMiddleware[] = []

  constructor(config: RequestConfig) {
    const { adapter, ...rest } = config
    this.adapter = adapter ?? null
    this.add(rest)
  }

  create(config: RequestConfig) {
    const instance = new RequestBuilder(config)
    instance.middlewares = this.middlewares
    return instance
  }

  with(middleware: BaseRequestMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  add(config: RequestConfig) {
    const { adapter, ...rest } = config

    if (this.adapter && adapter) {
      throw new Error("No change adapter")
    }

    const { url, method, headers, body, signal, timeout } = rest
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
    return this
  }

  append(path: string) {
    this.context.request.url += path
    return this
  }

  async request<T>(config: RequestConfig): Promise<T> {
    this.add(config)
    if (!this.adapter) {
      throw new Error("No adapter configured")
    }

    await pipeline(this.context, this.middlewares, this.adapter)
    if (this.context.error) {
      throw this.context.error
    }

    if (!this.context.response) {
      throw new UnknownError()
    }

    return this.context.response.data as T
  }

  get<T>(path?: string, data?: unknown) {
    return this.request<T>({ method: "GET", url: path, body: data })
  }

  post<T>(path?: string, data?: unknown) {
    return this.request<T>({ method: "POST", url: path, body: data })
  }

  put<T>(path?: string, data?: unknown) {
    return this.request<T>({ method: "PUT", url: path, body: data })
  }

  delete<T>(path?: string, data?: unknown) {
    return this.request<T>({ method: "DELETE", url: path, body: data })
  }
}
