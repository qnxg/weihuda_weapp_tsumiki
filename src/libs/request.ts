import type { Header, RequestConfig, RequestMethod, Response } from "@/types/request"
import Taro from "@tarojs/taro"
import { ENV } from "@/config/env"
import { LABEL } from "@/config/logger-label"
import { RequestError } from "@/types/request"
import { logger } from "@/utils/logger"

/**
 * @description 通用请求函数配置项
 * @template T - 响应数据的类型
 * @property {Header} [header] - 额外的请求头
 * @property {number} [timeout] - 请求超时时间, 单位为毫秒
 * @property {((config: RequestConfig) => void) | null} [onFetch=null] - 请求发送前回调
 * @property {((config: RequestConfig, err: any) => void) | null} [onError=null] - 请求错误回调
 * @property {((config: RequestConfig, err: any) => void) | null} [onNetworkError=null] - 网络错误回调
 * @property {((config: RequestConfig, error: unknown) => void) | null} [onServerError=null] - 服务器错误回调
 * @property {((config: RequestConfig, error: RequestError) => void) | null} [onBusinessError=null] - 业务错误回调
 * @property {((config: RequestConfig, response: T) => void) | null} [onSuccess=null] - 请求成功回调
 * @property {((config: RequestConfig, response: T | null, err: any) => void) | null} [onSettled=null] - 请求结束回调
 * @property {((config: RequestConfig, error: RequestError) => RequestError | void) | null} [businessErrorInterceptor=null] - 业务错误拦截器
 */
export interface RequestOptions<T> {
  header?: Header
  timeout?: number
  onFetch?: ((config: RequestConfig) => void) | null
  onError?: ((config: RequestConfig, err: any) => void) | null
  onNetworkError?: ((config: RequestConfig, err: any) => void) | null
  onServerError?: ((config: RequestConfig, error: unknown) => void) | null
  onBusinessError?: ((config: RequestConfig, error: RequestError) => void) | null
  onSuccess?: ((config: RequestConfig, response: T) => void) | null
  onSettled?: ((config: RequestConfig, response: T | null, err: any) => void) | null
  businessErrorInterceptor?: ((config: RequestConfig, error: RequestError) => RequestError | void) | null
}

const BASE_URL = ENV.BASE_URL

/**
 * @description 通用请求函数
 * @template T - 响应数据的类型
 * @param {string} url - 请求 URL, 会自动拼接 BASE_URL
 * @param {unknown} data - 请求数据
 * @param {RequestMethod} method - HTTP 请求方法
 * @param {RequestOptions} options - 请求配置项
 */
export async function request<T extends object | null = null>(
  url: string,
  data: unknown,
  method: RequestMethod,
  options: RequestOptions<T> = {},
): Promise<Response<T>> {
  const {
    header = {},
    timeout,
    onFetch = null,
    onError = null,
    onNetworkError = null,
    onServerError = null,
    onBusinessError = null,
    onSuccess = null,
    onSettled = null,
    businessErrorInterceptor = null,
  } = options

  const mergedHeader: Header = {
    "Content-Type": "application/json",
    ...header,
  }

  const config: RequestConfig = { url, data, method, header: mergedHeader }

  onFetch?.(config)

  let res: Taro.request.SuccessCallbackResult
  try {
    res = await Taro.request({
      url: BASE_URL + url,
      data,
      method,
      header: mergedHeader,
      timeout,
    })
  }
  catch (err) {
    // 请求发送错误 (超时等)
    logger.error(LABEL.lib.request.NETWORK_ERROR, `${method} ${url}: `, err)
    onNetworkError?.(config, err)
    onError?.(config, err)
    onSettled?.(config, null, err)
    throw new RequestError(-1, "NETWORK_ERROR", null)
  }

  // 服务器错误 (5xx)
  if (res.statusCode >= 500) {
    logger.error(LABEL.lib.request.SERVER_ERROR, `${method} ${url}: `, res.data)
    onServerError?.(config, res.data)
    onError?.(config, res.data)
    onSettled?.(config, null, res.data)
    throw new RequestError(res.statusCode, "SERVER_ERROR", null)
  }

  const response = res.data as Response<T>

  // 其他非 200 错误及 200 的业务错误 (业务错误)
  if (res.statusCode !== 200 || response.code !== "OK") {
    let error = new RequestError(res.statusCode, response.code, response.data)
    onBusinessError?.(config, error)

    if (businessErrorInterceptor) {
      const intercepted = businessErrorInterceptor(config, error)
      // 拦截器返回 RequestError, 用新的 error 继续抛出
      if (intercepted !== undefined) {
        error = intercepted
      }
    }

    onError?.(config, error)
    onSettled?.(config, null, error)
    throw error
  }

  onSuccess?.(config, response.data)
  onSettled?.(config, response.data, null)
  return response
}

request.get = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "GET", options)

request.post = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "POST", options)

request.put = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "PUT", options)

request.delete = <T extends object | null = null>(url: string, data?: unknown, options: RequestOptions<T> = {}) =>
  request<T>(url, data, "DELETE", options)
