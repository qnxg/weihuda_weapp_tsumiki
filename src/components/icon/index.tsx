import type { ComponentProps } from "react"
import { Image } from "@tarojs/components"
import { cn } from "@/utils/cn"
import "./index.scss"

/**
 * @description 图标组件
 * @example
 * ```tsx
 * <Icon src={img} />
 * ```
 */
export function Icon({
  src,
  className,
  theme = "auto",
  ...props
}: Readonly<{
  theme?: "light" | "dark" | "auto"
} & ComponentProps<typeof Image>>) {
  return (
    <Image
      className={cn(`icon--${theme}`, className)}
      src={src}
      {...props}
    />
  )
}
