import type { CSSProperties } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

// 检测 className 是否含 size/w/h 体系的高度类 (避免 size-* 透传给 Skeleton 后被 inline 32rpx 覆盖)
// 匹配: size / size-s / size-m / size-l / h / h-s / h-m / h-l 及它们的类名 (如 size-sm, h-l-xs)
const HAS_HEIGHT_CLASS = /(?:^|\s)(?:size(?:-[sml])?-|h(?:-[sml])?-|size\b|h\b)/

function Skeleton({
  className,
  style,
}: Readonly<{
  className?: string
  style?: CSSProperties
}>) {
  const hasHeight = HAS_HEIGHT_CLASS.test(className ?? "")
  return (
    <View
      className={cn("rounded bg-subtle", className)}
      style={{
        height: hasHeight ? "" : "32rpx",
        ...style,
      }}
    />
  )
}

export { Skeleton }
