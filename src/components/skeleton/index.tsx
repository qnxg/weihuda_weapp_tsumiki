import type { CSSProperties } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

function Skeleton({
  className,
  style,
}: Readonly<{
  className?: string
  style?: CSSProperties
}>) {
  return (
    <View
      className={cn("rounded bg-subtle", className)}
      style={{
        height: className?.includes("h") ? "" : "32rpx",
        ...style,
      }}
    />
  )
}

export { Skeleton }
