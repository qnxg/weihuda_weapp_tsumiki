import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import ToIcon from "@/static/common/to.svg"
import { cn } from "@/utils/cn"
import { navigate } from "@/utils/navigate"

type Size = "sm" | "md" | "lg"

export interface OptionItem {
  title: string | ReactNode
  icon?: string
  content?: string | ReactNode
  to?: string
  size?: Size
  onClick?: () => void
}

function Option({
  title,
  icon,
  content,
  to,
  size = "md",
  onClick,
}: Readonly<OptionItem>) {
  const handleClick = () => {
    if (to)
      navigate(to)
    onClick?.()
  }

  return (
    <View
      className={cn(
        "flex items-center justify-between bg",
        size === "sm" && "py-sm",
        size === "md" && "py-md",
        size === "lg" && "py-lg",
      )}
      onClick={() => handleClick()}
    >
      <View>
        {icon && (
          <Icon
            src={icon}
            className={cn(
              size === "sm" && "size-sm",
              size === "md" && "size-md",
              size === "lg" && "size-lg",
            )}
          />
        )}
        {title}
      </View>
      <View>
        {content && (<View>{content}</View>)}
        {!content && (to || onClick) && (
          <Icon
            src={ToIcon}
            className={cn(
              size === "sm" && "size-sm",
              size === "md" && "size-md",
              size === "lg" && "size-lg",
            )}
          />
        )}
      </View>
    </View>
  )
}

/**
 * @description 操作列表组件
 * @example
 * 1. 直接传入 Option
 * ```tsx
 * <Options>
 *   <Option {...props} />
 *   <Option {...props} />
 * </Options>
 * ```
 * 2. 传入 OptionItem 数组
 * ```tsx
 * <Options items={items} />
 * ```
 */
function Options({
  items,
  type = "divided",
  children,
}: Readonly<{
  items?: OptionItem[]
  // 操作列表的类型, 决定 Option 之间的分隔线样式, 默认为 "divided"
  type?: "divided" | "underline" | "plain"
  children?: ReactNode
}>) {
  return (
    <View
      className="flex flex-col bg-page"
      style={{
        gap: type !== "plain" ? "6rpx" : "",
        paddingBottom: type === "underline" ? "6rpx" : "",
      }}
    >
      {items && items.length > 0 && items.map((option, index) => (
        <Option
          key={`${option.title}_${index}`}
          title={option.title}
          icon={option.icon}
          content={option.content}
          to={option.to}
          size={option.size}
          onClick={option.onClick}
        />
      ))}
      {children}
    </View>
  )
}

export { Option, Options }
