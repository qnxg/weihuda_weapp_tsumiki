import type { BaseRequestMiddleware, RequestAdapter, RequestContext } from "@/types/new-request"
import { BaseRequestError, UnknownError } from "@/types/new-request/error"

/**
 * @description 请求中间件请求管线
 */
async function runRequestPipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
): Promise<{ ctx: RequestContext, proceed: boolean }> {
  let index = 0
  const ctx = context

  const next = async (currentCtx: RequestContext): Promise<RequestContext> => {
    const middleware = middlewares[index++]

    if (!middleware)
      return currentCtx

    if (middleware.onStart) {
      let called = false
      return middleware.onStart(currentCtx, async (passedCtx) => {
        if (called) {
          throw new Error("next() called multiple times")
        }
        called = true
        return next(passedCtx)
      })
    }
    else {
      return next(currentCtx)
    }
  }

  const finalCtx = await next(ctx)
  return { ctx: finalCtx, proceed: index >= middlewares.length }
}

/**
 * @description 请求中间件响应管线
 */
async function runResponsePipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
): Promise<RequestContext> {
  let index = middlewares.length - 1
  const ctx = context

  const next = async (currentCtx: RequestContext): Promise<RequestContext> => {
    const middleware = middlewares[index--]

    if (!middleware)
      return currentCtx

    const hook = currentCtx.error ? middleware.onError : middleware.onSuccess

    if (hook) {
      let called = false
      return hook(currentCtx, async (passedCtx) => {
        if (called) {
          throw new Error("next() called multiple times")
        }
        called = true
        return next(passedCtx)
      })
    }
    else {
      return next(currentCtx)
    }
  }

  return next(ctx)
}

/**
 * @description 请求中间件总管线
 */
export async function pipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
  adapter: RequestAdapter,
): Promise<RequestContext> {
  const { ctx: ctxAfterStart, proceed } = await runRequestPipeline(context, middlewares)
  if (!proceed || ctxAfterStart.error)
    return ctxAfterStart

  let ctx: RequestContext
  try {
    const response = await adapter(ctxAfterStart)
    ctx = { ...ctxAfterStart, response, error: null }
  }
  catch (error) {
    const classified = error instanceof BaseRequestError ? error : new UnknownError(error)
    ctx = { ...ctxAfterStart, response: null, error: classified }
  }

  return runResponsePipeline(ctx, middlewares)
}
