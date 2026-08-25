import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

type TagTheme = "default" | "primary" | "warning"

/**
 * @description 成绩页标签
 */
export function Tag({
  theme = "default",
  children,
  className,
  ...props
}: Readonly<{
  theme?: TagTheme
  children: ReactNode
} & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn(
        "text-sm px-sm py-xs rounded-sm",
        theme === "primary" && "text-primary bg-blue",
        theme === "default" && "text-base bg-page",
        theme === "warning" && "text-orange bg-orange",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  )
}
