import type { ReactNode } from "react"
import { View } from "@tarojs/components"

function Page({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="w-screen h-screen bg text">
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
