import type { ComponentProps } from "react"
import { Image } from "@tarojs/components"
import { cn } from "@/utils/cn"

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
  ...props
}: Readonly<ComponentProps<typeof Image>>) {
  return (
    <Image
      className={cn("icon", className)}
      src={src}
      {...props}
    />
  )
}
