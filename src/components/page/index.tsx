import type { ReactNode } from "react"
import { View } from "@tarojs/components"

/**
 * @description 页面内容组件, 提供页面基本布局样式
 * @example
 * ```tsx
 * <Page>
 *   纯白背景内容
 *   <PageContent>
 *     淡白色带边距内容, 自动占满页面剩余高度
 *   </PageContent>
 * </Page>
 * ```
 */
function Page({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="w-screen h-screen flex flex-col bg text">
      {children}
    </View>
  )
}

function PageContent({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="p bg-page flex-1">
      {children}
    </View>
  )
}

export { Page, PageContent }
