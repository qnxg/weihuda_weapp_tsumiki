import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { CardAction, CardHeader, CardIcon, CardTitle } from "./header"

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
 * @param {string} [background] - 背景颜色原子类 token, 未设置时使用默认主题背景
 */
function Card({
  background,
  className,
  children,
  ...props
}: Readonly<{
  background?: string
} & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn(
        "p rounded-sm flex flex-col gap",
        background ? `bg-${background}` : "bg",
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
