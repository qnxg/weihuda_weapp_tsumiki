import type { ComponentProps, CSSProperties } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { getTheme } from "@/utils/theme"

/**
 * @description 表格容器, grid + gap 1rpx hack: 底色透出作为内边框, 单元格 bg 铺底
 */
export function Table({
  cols,
  className,
  style,
  children,
  ...props
}: Readonly<{ cols: number } & ComponentProps<typeof View>>) {
  const { isDark } = getTheme()

  return (
    <View
      className={cn("w-full overflow-hidden", className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "1rpx",
        padding: "1rpx",
        backgroundColor: isDark ? "#666666" : "#cccccc",
        ...(style as CSSProperties),
      }}
      {...props}
    >
      {children}
    </View>
  )
}

const CELL_COLOR: Record<string, string> = {
  green: "#c8e6c9",
  blue: "#bbdefb",
  orange: "#ffe0b2",
  red: "#ffcdd2",
}

type CellColor = keyof typeof CELL_COLOR

/**
 * @description 表格单元格, 默认铺 bg 底色 + 内边距 + 居中, className 可覆盖, 可传入 color 染色, span 跨行
 */
export function TableCell({
  color,
  span,
  className,
  style,
  ...props
}: Readonly<{
  color?: CellColor
  span?: number
} & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn("bg px py-sm flex center", className)}
      style={{
        ...(color ? { backgroundColor: CELL_COLOR[color] } : {}),
        ...(span ? { gridRow: `span ${span}` } : {}),
        ...(style as CSSProperties),
      }}
      {...props}
    />
  )
}

/**
 * @description 表格表头单元格, 加深背景以区分数据行
 */
export function TableHead({
  className,
  style,
  ...props
}: Readonly<ComponentProps<typeof View>>) {
  const { isDark } = getTheme()

  return (
    <TableCell
      className={cn("text-bold", className)}
      style={{
        backgroundColor: isDark ? "#303030" : "#eeeeee",
        ...(style as CSSProperties),
      }}
      {...props}
    />
  )
}
