import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { CardAction, CardHeader, CardIcon, CardTitle } from "./header"

// 检测 className 是否含 bg-* 背景类, 是则不附加默认 bg, 避免与用户的 bg-* 冲突
const HAS_BG_CLASS = /(?:^|\s)bg-/

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
 */
function Card({
  className,
  children,
  ...props
}: Readonly<ComponentProps<typeof View>>) {
  const hasBg = HAS_BG_CLASS.test(className ?? "")
  return (
    <View
      className={cn(
        "p rounded-sm flex flex-col gap",
        hasBg ? "" : "bg",
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
