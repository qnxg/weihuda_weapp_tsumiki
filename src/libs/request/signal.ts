import type { RequestSignal } from "@/types/request"

/**
 * @description 通用请求中断控制器
 */
export class RequestController {
  signal: RequestSignal = { aborted: false }

  abort(): void {
    if (this.signal.aborted) {
      return
    }
    this.signal.aborted = true
    this.signal.onAbort?.()
  }
}
