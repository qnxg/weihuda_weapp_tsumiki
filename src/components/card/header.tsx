import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { navigate } from "@/libs/navigate"

/**
 * @description 卡片头部
 * @example
 * 1. 传入 CardIcon, CardTitle, CardAction 组件作为子元素
 * ```tsx
 * <CardHeader>
 *   <CardIcon>icon</CardIcon>
 *   <CardTitle>title</CardTitle>
 *   <CardAction to="/path">action</CardAction>
 * </CardHeader>
 * ```
 * 2. 传入 props
 * ```tsx
 * <CardHeader
 *   icon="icon"
 *   title="title"
 *   action="action"
 *   to="/path"
 * />
 * ```
 */
function CardHeader({
  icon,
  title,
  action,
  to,
  onClick,
  children,
}: Readonly<{
  icon?: ReactNode
  title?: string | ReactNode
  action?: string | ReactNode
  to?: string
  onClick?: () => void
  children: ReactNode
}>) {
  return (
    <View className="flex items-center gap">
      {icon ? <CardIcon>{icon}</CardIcon> : null}
      {title ? <CardTitle>{title}</CardTitle> : null}
      {action ? <CardAction to={to} onClick={onClick}>{action}</CardAction> : null}
      {children}
    </View>
  )
}

function CardIcon({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="text-base text-xl">
      {children}
    </View>
  )
}

function CardTitle({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="flex-1 text-hightlight">
      {children}
    </View>
  )
}

function CardAction({
  children,
  to,
  onClick,
}: Readonly<{
  children: ReactNode
  to?: string
  onClick?: () => void
}>) {
  const handleClick = () => {
    if (to)
      navigate(to)
    onClick?.()
  }

  return (
    <View
      className="text-highlight"
      onClick={handleClick}
    >
      {children}
    </View>
  )
}

export { CardAction, CardHeader, CardIcon, CardTitle }
