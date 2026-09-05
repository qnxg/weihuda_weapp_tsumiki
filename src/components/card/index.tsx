import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { CardAction, CardHeader, CardIcon, CardTitle } from "./header"

type CardBackground = "primary" | "success" | "warning" | "danger"

const CARD_BACKGROUND_CLASS: Record<CardBackground, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
}

/**
 * @description 卡片组件
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader />
 *   <CardContent>
 *     content
 *   </CardContent>
 * </Card>
 * ```
 * @param {CardBackground} [background] - 卡片背景颜色, 未设置时使用默认主题背景
 */
function Card({
  background,
  className,
  children,
  ...props
}: Readonly<{
  background?: CardBackground
} & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn(
        "p rounded-sm flex flex-col gap",
        background ? CARD_BACKGROUND_CLASS[background] : "bg",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  )
}

function CardContent({
  children,
  ...props
}: Readonly<{
  children: ReactNode
} & ComponentProps<typeof View>>) {
  return (
    <View {...props}>
      {children}
    </View>
  )
}

export { Card, CardAction, CardContent, CardHeader, CardIcon, CardTitle }
