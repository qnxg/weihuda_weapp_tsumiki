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

/**
 * @description 表格单元格, 默认铺 bg 底色 + 内边距 + 居中, className 可覆盖
 */
export function TableCell({
  className,
  ...props
}: Readonly<ComponentProps<typeof View>>) {
  return <View className={cn("bg px py-sm flex center", className)} {...props} />
}

/**
 * @description 表格表头单元格, 加深背景以区分数据行
 */
export function TableHeaderCell({
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

/** 等级背景色: 优秀/正常, 良好/低体重, 及格/超重, 不及格/肥胖 */
const LEVEL_BG = {
  excellent: "#c8e6c9",
  good: "#bbdefb",
  pass: "#ffe0b2",
  fail: "#ffcdd2",
} as const

type LevelKey = keyof typeof LEVEL_BG

/**
 * @description 等级单元格, 按等级上色, 可选跨行
 */
export function LevelCell({
  level,
  span,
  className,
  style,
  ...props
}: Readonly<{
  level: LevelKey
  span?: number
} & ComponentProps<typeof View>>) {
  return (
    <TableCell
      className={className}
      style={{
        backgroundColor: LEVEL_BG[level],
        ...(span ? { gridRow: `span ${span}` } : {}),
        ...(style as CSSProperties),
      }}
      {...props}
    />
  )
}
