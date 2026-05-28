import type { Response } from "@/libs/request"
import { RequestError } from "@/libs/request"

/**
 * @description Mock 请求配置项
 * @property {"auto" | number} [delay="auto"] - 延迟(ms), "auto" 则随机 0-5000
 * @property {number} [errorRate=0] - 报错概率 0-1
 */
interface MockRequestOptions {
  delay?: "auto" | number
  errorRate?: number
}

function randomDelay(): number {
  return Math.floor(Math.random() * 5001)
}

/**
 * @description Mock 请求函数
 * @template T - 返回数据类型
 * @param {T} data - 模拟返回数据
 * @param {MockRequestOptions} [options] - 配置项
 */
export async function mockRequest<T extends object | null>(
  data: T,
  options: MockRequestOptions = {},
): Promise<Response<T>> {
  const { delay = "auto", errorRate = 0 } = options

  const ms = delay === "auto" ? randomDelay() : delay

  await new Promise<void>(resolve => setTimeout(resolve, ms))

  if (Math.random() < errorRate) {
    throw new RequestError(-1, "MOCK_ERROR", null)
  }

  return { code: "OK", data } as Response<T>
}
