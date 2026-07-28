import type { ComponentProps, CSSProperties } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/**
 * @description 表格容器, grid + gap 1rpx hack: 底色 bg-page 透出作为内边框, 单元格 bg 铺底
 */
export function Table({
  cols,
  className,
  style,
  children,
  ...props
}: Readonly<{ cols: number } & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn("w-full bg-page rounded-sm overflow-hidden", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "1rpx",
        padding: "1rpx",
        ...(style as CSSProperties),
      }}
      {...props}
    >
      {children}
    </View>
  )
}

/**
 * @description 表格单元格, 默认铺 bg 底色 + 内边距 + 居中, className 可覆盖
 */
export function TableCell({
  className,
  ...props
}: Readonly<ComponentProps<typeof View>>) {
  return <View className={cn("bg px py-xs flex center", className)} {...props} />
}
