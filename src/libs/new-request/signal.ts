import type { RequestSignal } from "@/types/new-request"

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
