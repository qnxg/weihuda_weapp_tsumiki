import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
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
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="p bg rounded-sm flex flex-col gap">
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
