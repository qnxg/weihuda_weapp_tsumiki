import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { navigateTo } from "@tarojs/taro"
import { cn } from "@/utils/cn"

function Button({
  disabled = false,
  active = null,
  to,
  onClick,
  children,
  className,
  ...props
}: Readonly<{
  active?: boolean | null
  to?: string
  disabled?: boolean
  onClick?: () => void
  children?: ReactNode
  className?: string
} & ComponentProps<typeof View>>) {
  const handleClick = () => {
    if (disabled)
      return
    if (to)
      void navigateTo({ url: to })
    onClick?.()
  }

  return (
    <View
      className={cn(
        className,
        { "bg-primary text-reverse": active === true },
        { "bg-transparent text-base": active === false },
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </View>
  )
}

export { Button }
