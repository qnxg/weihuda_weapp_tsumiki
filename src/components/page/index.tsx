import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import "./index.scss"

/**
 * @description 页面内容组件, 提供页面基本布局样式
 * @example
 * ```tsx
 * <Page isLoading={isLoading}>
 *   纯白背景内容, 在 loading 时自动整页的动画
 *   <PageContent>
 *     淡白色带边距内容, 自动占满页面剩余高度
 *   </PageContent>
 * </Page>
 * ```
 */
function Page({
  children,
  isLoading = false,
}: Readonly<{
  children: ReactNode
  isLoading?: boolean
}>) {
  return (
    <View className="w-screen h-screen flex flex-col bg text overflow-hidden">
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

function PageContent({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="p bg-page flex-1 overflow-hidden">
      {children}
    </View>
  )
}

export { Page, PageContent }
