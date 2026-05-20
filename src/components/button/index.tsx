import type { ButtonProps } from "@tarojs/components"
import type { ComponentProps, ReactNode } from "react"
import { Button as TaroButton, View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { navigate } from "@/utils/navigate"

function MyButton({
  disabled = false,
  active = null,
  to,
  onClick,
  children,
  className,
  formType,
  openType,
  ...props
}: Readonly<{
  active?: boolean | null
  to?: string
  disabled?: boolean
  onClick?: () => void
  children?: ReactNode
  className?: string
  formType?: keyof ButtonProps.FormType
  openType?: ButtonProps.OpenType
} & ComponentProps<typeof View>>) {
  const handleClick = () => {
    if (disabled)
      return
    if (to)
      navigate(to)
    onClick?.()
  }

  return (
    <View
      className={cn(
        "relative",
        className,
        { "bg-primary text-reverse": active === true },
        { "bg-transparent text-base": active === false },
      )}
      {...props}
    >
      <TaroButton
        className="absolute inset opacity"
        style={{
          zIndex: 10,
        }}
        disabled={disabled}
        onClick={handleClick}
        formType={formType}
        openType={openType}
      />
      {children}
    </View>
  )
}

export { MyButton }
