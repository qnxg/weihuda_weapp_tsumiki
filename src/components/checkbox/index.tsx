import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import CheckIcon from "@/static/common/check.svg"
import { cn } from "@/utils/cn"

/**
 * @description checkbox 样式的多选条目, 左侧方框, 右侧可选描述
 * @example
 * ```tsx
 * <Checkbox
 *   checked={selected}
 *   label="第 1 大节"
 *   description="08:00 - 09:40"
 *   onClick={() => toggle(1)}
 * />
 * ```
 */
function Checkbox({
  checked = false,
  label,
  description,
  className,
  ...props
}: Readonly<{
  checked?: boolean
  label?: ReactNode
  description?: ReactNode
  className?: string
} & ComponentProps<typeof View>>) {
  return (
    <View
      className={cn("flex items-center gap", className)}
      {...props}
    >
      <View
        className={cn(
          "rounded-sm flex center",
          checked ? "bg-primary border-primary" : "border-base",
        )}
        style={{
          width: "32rpx",
          height: "32rpx",
          flexShrink: 0,
        }}
      >
        {checked && (
          <Icon
            theme="light"
            src={CheckIcon}
            style={{
              width: "28rpx",
              height: "28rpx",
            }}
          />
        )}
      </View>
      <View className="flex-1 flex items-center justify-between">
        {label != null && (
          <View className={checked ? "text-primary" : undefined}>
            {label}
          </View>
        )}
        {description != null && (
          <View className="text-sm text-muted">{description}</View>
        )}
      </View>
    </View>
  )
}

export { Checkbox }
