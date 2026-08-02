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
        theme === "primary" && "text-primary",
        theme === "default" && "text-base bg-page",
        theme === "warning" && "text-warning bg-warning",
        className,
      )}
      style={
        theme === "primary"
          ? { backgroundColor: "rgba(50, 140, 203, 0.12)" }
          : undefined
      }
      {...props}
    >
      {children}
    </View>
  )
}
