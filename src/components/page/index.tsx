import type { ComponentProps, ReactNode } from "react"
import { ScrollView, View } from "@tarojs/components"
import { PullRefresh } from "@/components/pull-refresh"
import { cn } from "@/utils/cn"
import "./index.scss"

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
 * 1. 带下拉刷新
 * ```tsx
 * <PageContent onRefresh={onRefresh}>
 *   // 内容
 * </PageContent>
 * ```
 * 2. 禁用滚动
 * <PageContent fixed>
 *   // 内容
 * </PageContent>
 */
function PageContent({
  onRefresh,
  fixed = false,
  className,
  children,
  ...props
}: Readonly<{
  onRefresh?: (() => Promise<unknown>) | null
  fixed?: boolean
} & ComponentProps<typeof ScrollView>>) {
  if (fixed) {
    return (
      <View className={cn("bg-page overflow-hidden", className)}>
        {children}
      </View>
    )
  }

  if (onRefresh) {
    return (
      <View className={cn("bg-page overflow-hidden", className)}>
        <PullRefresh
          className="h-full"
          onRefresh={onRefresh}
          {...props}
        >
          {children}
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
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  )
}

export { Page, PageContent }
