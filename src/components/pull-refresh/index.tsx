import type { BaseEventOrig } from "@tarojs/components"
import type { ReactNode } from "react"
import { ScrollView, Slot, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useRef, useState } from "react"

const HEAD_HEIGHT = 50 // 同 h-sm

enum PullRefreshStatus {
  Awaiting = "awaiting",
  Pulling = "pulling",
  Loosing = "loosing",
  Loading = "loading",
}

const STATUS_TEXT: Record<string, string> = {
  [PullRefreshStatus.Pulling]: "下拉刷新",
  [PullRefreshStatus.Loosing]: "释放刷新",
  [PullRefreshStatus.Loading]: "加载中...",
}

/**
 * @description 下拉刷新组件
 * @example
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
  const [triggered, setTriggered] = useState(false)
  const statusRef = useRef<PullRefreshStatus>(PullRefreshStatus.Awaiting)
  const [statusText, setStatusText] = useState("")

  const updateStatus = useCallback((status: PullRefreshStatus) => {
    statusRef.current = status
    setStatusText(STATUS_TEXT[status] ?? "")
  }, [])

  const onPulling = useCallback(
    (e: BaseEventOrig) => {
      const dy: number = e.detail?.dy ?? 0
      if (dy >= HEAD_HEIGHT) {
        updateStatus(PullRefreshStatus.Loosing)
      }
      else if (dy > 0) {
        updateStatus(PullRefreshStatus.Pulling)
      }
    },
    [updateStatus],
  )

  const runRefresh = useCallback(async () => {
    updateStatus(PullRefreshStatus.Loading)
    setTriggered(true)
    try {
      await onRefresh()
    }
    finally {
      Taro.nextTick(() => {
        setTriggered(false)
        updateStatus(PullRefreshStatus.Awaiting)
      })
    }
  }, [onRefresh, updateStatus])

  const onRestore = useCallback(() => {
    Taro.nextTick(() => {
      setTriggered(false)
      updateStatus(PullRefreshStatus.Awaiting)
    })
  }, [updateStatus])

  const darkMode = Taro.getAppBaseInfo().theme === "dark"

  return (
    <ScrollView
      scrollY
      enhanced
      showScrollbar={false}
      refresherEnabled
      refresherThreshold={HEAD_HEIGHT}
      refresherBackground={darkMode ? "#000000" : "#fafafa"} // 同 bg-page
      refresherDefaultStyle="none"
      refresherTriggered={triggered}
      onRefresherPulling={onPulling}
      onRefresherRefresh={runRefresh}
      onRefresherRestore={onRestore}
      onRefresherAbort={onRestore}
    >
      <Slot name="refresher">
        {statusText && (
          <View className="w-screen h-sm flex center">{statusText}</View>
        )}
      </Slot>
      {children}
    </ScrollView>
  )
}

export { PullRefresh }
