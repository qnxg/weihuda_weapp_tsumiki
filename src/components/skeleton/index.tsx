import type { CSSProperties } from "react"
import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { cn } from "@/utils/cn"

function Skeleton({
  className,
  style,
}: Readonly<{
  className?: string
  style?: CSSProperties
}>) {
  const darkMode = Taro.getAppBaseInfo().theme === "dark"

  return (
    <View
      className={cn("rounded", className)}
      style={{
        backgroundColor: darkMode ? "#303030" : "#f7f7f7",
        height: className?.includes("h") ? "" : "32rpx",
        ...style,
      }}
    />
  )
}

export { Skeleton }
