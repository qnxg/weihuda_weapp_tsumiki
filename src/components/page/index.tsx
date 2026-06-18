import type { ComponentProps, ReactElement, ReactNode } from "react"
import { ScrollView, View } from "@tarojs/components"
import { PullRefresh } from "@/components/pull-refresh"
import { cn } from "@/utils/cn"
import "./index.scss"

function cloneWithScrollProps(element: ReactNode, isScrollToLower?: boolean): ReactNode {
  if (!element || typeof element !== "object")
    return element
  const el = element as ReactElement
  if (!el.props)
    return element
  return {
    ...el,
    props: {
      ...el.props,
      isScrollToLower,
    },
  }
}

/**
 * @description 页面容器组件, 提供基本布局样式, 支持 loading 状态
 */
function Page({
  children,
  isLoading = false,
}: Readonly<{
  children: ReactNode
  isLoading?: boolean
}>) {
  return (
    <View className="relative w-screen h-screen flex flex-col bg text overflow-hidden">
      {isLoading
        ? (
            <View className="w-full h-full flex justify-center items-center">
              <View
                className="relative size rounded-full spin"
                style={{
                  background: "conic-gradient(from 0deg, #222222, #aaaaaa)",
                  opacity: "0.5",
                }}
              >
                <View className="absolute inset-xs rounded-full bg" />
              </View>
            </View>
          )
        : children}
    </View>
  )
}

/**
 * @description 页面内容组件
 * @example
 * 1. 带下拉刷新（非受控）
 * ```tsx
 * <PageContent onRefresh={onRefresh}>
 *   // 内容
 * </PageContent>
 * ```
 * 2. 带下拉刷新（受控）
 * ```tsx
 * <PageContent isRefreshing={isRefreshing} onRefresh={handleRefresh}>
 *   // 内容
 * </PageContent>
 * ```
 * 3. 带触底刷新（受控）
 * ```tsx
 * <PageContent
 *   isScrollToLower={isScrollToLower}
 *   onScrollReached={() => setIsScrollToLower(true)}
 *   lowerThreshold={50}
 * >
 *   <Record isScrollToLower={isScrollToLower} onRefetchFinish={() => setIsScrollToLower(false)} />
 * </PageContent>
 * ```
 * 4. 禁用滚动
 * <PageContent fixed>
 *   // 内容
 * </PageContent>
 */
function PageContent({
  onRefresh,
  isRefreshing,
  isScrollToLower,
  onScrollReached,
  lowerThreshold,
  fixed = false,
  className,
  children,
  ...props
}: Readonly<{
  onRefresh?: (() => void | Promise<unknown>) | null
  isRefreshing?: boolean
  isScrollToLower?: boolean
  onScrollReached?: () => void
  lowerThreshold?: number
  fixed?: boolean
} & ComponentProps<typeof ScrollView>>) {
  if (fixed) {
    return (
      <View className={cn("bg-page overflow-hidden", className)}>
        {cloneWithScrollProps(children, isScrollToLower)}
      </View>
    )
  }

  const enablePullRefresh = onRefresh || isRefreshing !== undefined

  if (enablePullRefresh) {
    return (
      <View className={cn("bg-page overflow-hidden", className)}>
        <PullRefresh
          className="h-full"
          onRefresh={onRefresh ?? undefined}
          isRefreshing={isRefreshing}
          lowerThreshold={lowerThreshold}
          onScrollToLower={isScrollToLower !== undefined ? () => onScrollReached?.() : undefined}
          {...props}
        >
          {cloneWithScrollProps(children, isScrollToLower)}
        </PullRefresh>
      </View>
    )
  }

  return (
    <View className={cn("bg-page overflow-hidden", className)}>
      <ScrollView
        className="h-full"
        scrollY
        enhanced
        showScrollbar={false}
        lowerThreshold={lowerThreshold}
        onScrollToLower={isScrollToLower !== undefined ? () => onScrollReached?.() : undefined}
        {...props}
      >
        {cloneWithScrollProps(children, isScrollToLower)}
      </ScrollView>
    </View>
  )
}

export { Page, PageContent }
