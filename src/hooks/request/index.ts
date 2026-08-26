/**
 * @description TanStack Query 风格的自研请求 Hook
 *
 * tanstack/react-query 在 Taro (小程序) 环境下存在兼容性问题, 因此仿照其 API, 简化实现一套等价 hook
 */

export {
  KEEP_PREVIOUS_DATA,
  useQuery,
} from "./query"

export type {
  FetchStatus,
  KeepPreviousData,
  QueryFunction,
  QueryStatus,
  UseQueryOptions,
  UseQueryResult,
} from "./query"
