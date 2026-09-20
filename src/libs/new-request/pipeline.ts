import type { BaseRequestMiddleware, RequestAdapter, RequestContext } from "@/types/new-request"
import { BaseRequestError, UnknownError } from "@/types/new-request/error"

async function runRequestPipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
): Promise<boolean> {
  let index = 0
  const next = async () => {
    const middleware = middlewares[index++]

    if (!middleware)
      return

    if (middleware.onStart) {
      let called = false
      await middleware.onStart(context, async () => {
        if (called) {
          throw new Error("next() called multiple times")
        }
        called = true
        await next()
      })
    }
    else {
      await next()
    }
  }

  await next()
  return index >= middlewares.length
}

async function runResponsePipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
) {
  let index = middlewares.length - 1
  const next = async () => {
    const middleware = middlewares[index--]

    if (!middleware)
      return

    const func = context.error ? middleware.onError : middleware.onSuccess

    if (func) {
      let called = false
      await func(context, async () => {
        if (called) {
          throw new Error("next() called multiple times")
        }
        called = true
        await next()
      })
    }
    else {
      await next()
    }
  }

  await next()
}

export async function pipeline(
  context: RequestContext,
  middlewares: BaseRequestMiddleware[],
  adapter: RequestAdapter,
) {
  const proceed = await runRequestPipeline(context, middlewares)
  if (!proceed || context.error)
    return

  try {
    context.response = await adapter(context)
  }
  catch (error) {
    context.error = error instanceof BaseRequestError ? error : new UnknownError(error)
  }

  await runResponsePipeline(context, middlewares)
}
