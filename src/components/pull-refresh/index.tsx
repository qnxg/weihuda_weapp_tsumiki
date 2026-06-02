import type { BaseEventOrig } from "@tarojs/components"
import type { ReactNode } from "react"
import { ScrollView, Slot, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useMemo, useReducer } from "react"

const HEAD_HEIGHT = 50 // 同 h-sm

type PullStatus = "awaiting" | "pulling" | "loosing" | "loading"

interface State {
  status: PullStatus
  triggered: boolean
}

type Action
  = | { type: "PULLING", dy: number }
    | { type: "RELEASE" }
    | { type: "REFRESH" }
    | { type: "RESTORE" }

/**
 * @description PullRefresh 的 reducer 状态机
 * ## 状态说明
 *   1. awaiting: 初始/空闲状态 - 等待下拉, triggered: false
 *   2. pulling: 下拉中 - 用户正在下拉, 未达到阈值, triggered: false
 *   3. loosing: 释放状态 - 下拉超过阈值, triggered: false
 *   4. loading: 加载中 - 正在刷新, triggered: true
 * ## Action 说明
 *   1. PULLING: 用户下拉过程中, 根据 dy 更新状态
 *   2. RELEASE: 用户释放但未触发刷新(下拉距离不足)
 *   3. REFRESH: 触发刷新, 进入 loading 状态
 *   4. RESTORE: 刷新完成, 恢复初始状态
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PULLING":
      if (action.dy >= HEAD_HEIGHT) {
        return { status: "loosing", triggered: false }
      }
      else if (action.dy > 0) {
        return { status: "pulling", triggered: false }
      }
      return state
    case "RELEASE":
      return { status: "awaiting", triggered: false }
    case "REFRESH":
      return { status: "loading", triggered: true }
    case "RESTORE":
      return { status: "awaiting", triggered: false }
    default:
      return state
  }
}

const STATUS_TEXT: Record<PullStatus, string> = {
  awaiting: "",
  pulling: "下拉刷新",
  loosing: "释放刷新",
  loading: "加载中...",
}

/**
 * @description 下拉刷新组件
 * @example
 * 接受一个 Promise, 会在下拉时进入刷新状态, 触发 Promise, 并在 Promise 完成后恢复初始状态
 * ```tsx
 * <PullRefresh onRefresh={() => handleRefresh()}>
 *   内容
 * </PullRefresh>
 * ```
 */
function PullRefresh({
  onRefresh,
  children,
}: Readonly<{
  onRefresh: () => Promise<void> | void
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, {
    status: "awaiting",
    triggered: false,
  })

  const statusText = useMemo(() => STATUS_TEXT[state.status], [state.status])

  const onPulling = useCallback((e: BaseEventOrig) => {
    const dy: number = e.detail?.dy ?? 0
    dispatch({ type: "PULLING", dy })
  }, [])

  const handleRefresh = useCallback(async () => {
    dispatch({ type: "REFRESH" })
    try {
      await onRefresh()
    }
    finally {
      Taro.nextTick(() => {
        dispatch({ type: "RESTORE" })
      })
    }
  }, [onRefresh])

  const onRestore = useCallback(() => {
    Taro.nextTick(() => {
      dispatch({ type: "RESTORE" })
    })
  }, [])

  const darkMode = Taro.getAppBaseInfo().theme === "dark"

  return (
    <ScrollView
      className="h-full flex-1"
      scrollY
      enhanced
      showScrollbar={false}
      refresherEnabled
      refresherThreshold={HEAD_HEIGHT}
      refresherBackground={darkMode ? "#000000" : "#fafafa"} // 同 bg-page
      refresherDefaultStyle="none"
      refresherTriggered={state.triggered}
      onRefresherPulling={onPulling}
      onRefresherRefresh={handleRefresh}
      onRefresherRestore={onRestore}
      onRefresherAbort={onRestore}
    >
      <Slot name="refresher" className="w-full">
        {statusText && (
          <View className="h-sm flex center">{statusText}</View>
        )}
      </Slot>
      {children}
    </ScrollView>
  )
}

export { PullRefresh }
