import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { navigate } from "@/utils/navigate"

function CardHeader({
  icon,
  title,
  action,
  to,
  children,
}: Readonly<{
  icon?: ReactNode
  title?: string | ReactNode
  action?: string | ReactNode
  to?: string
  children: ReactNode
}>) {
  return (
    <View className="flex items-center gap">
      {icon ? <CardIcon>{icon}</CardIcon> : null}
      {title ? <CardTitle>{title}</CardTitle> : null}
      {action ? <CardAction to={to}>{action}</CardAction> : null}
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
