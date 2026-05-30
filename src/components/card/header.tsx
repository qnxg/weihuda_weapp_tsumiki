import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import { navigate } from "@/utils/navigate"

/**
 * @description 卡片头部
 * @example
 * 1. 传入 CardIcon, CardTitle, CardAction 组件作为子元素
 * ```tsx
 * <CardHeader>
 *   <CardIcon src={icon} />
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
  icon?: string
  title?: string | ReactNode
  action?: string | ReactNode
  to?: string
  onClick?: () => void
  children?: ReactNode
}>) {
  return (
    <View className="flex items-center gap-sm">
      {icon ? <CardIcon src={icon} /> : null}
      {title ? <CardTitle>{title}</CardTitle> : null}
      {action ? <CardAction to={to} onClick={onClick}>{action}</CardAction> : null}
      {children}
    </View>
  )
}

function CardIcon({
  src,
}: Readonly<{
  src: string
}>) {
  return (
    <Icon
      style={{
        width: "1.5rem",
        height: "1.5rem",
      }}
      src={src}
    />
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
