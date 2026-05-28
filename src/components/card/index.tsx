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
 */
function Card({
  className,
  children,
}: Readonly<{
  className?: string
  children: ReactNode
}>) {
  return (
    <View className={cn("p bg rounded-sm flex flex-col gap", className)}>
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
