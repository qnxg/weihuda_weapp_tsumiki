import type { ComponentProps } from "react"
import { MyButton } from "@/components/my-button"
import { cn } from "@/utils/cn"

export function SwitchButton({
  active,
  className,
  children,
  ...props
}: Readonly<ComponentProps<typeof MyButton>>) {
  return (
    <MyButton
      className={cn(
        "px-sm py-xs rounded-sm",
        active ? "text-primary border-primary" : "text-muted border-muted",
        className,
      )}
      {...props}
    >
      {children}
    </MyButton>
  )
}
