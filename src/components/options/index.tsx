import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Icon } from "@/components/icon"
import ToIcon from "@/static/common/to.svg"
import { cn } from "@/utils/cn"
import { navigate } from "@/utils/navigate"
import { getTheme } from "@/utils/theme"

type Size = "sm" | "md" | "lg" | "xl"
type Layout = "horizontal" | "vertical"

export interface OptionItem {
  title: string | ReactNode
  icon?: string
  content?: string | ReactNode
  to?: string
  size?: Size
  /**
   * @description 布局方式
   * - horizontal: 标题左, 内容右 (默认)
   * - vertical: 标题上, 内容下
   */
  layout?: Layout
  className?: string
  onClick?: () => void
}

function Option({
  title,
  icon,
  content,
  to,
  size = "md",
  layout = "horizontal",
  className,
  onClick,
}: Readonly<OptionItem>) {
  const handleClick = () => {
    if (to)
      navigate(to)
    onClick?.()
  }

  const ICON_SIZE_MAP: Record<Size, string> = {
    sm: "32rpx",
    md: "40rpx",
    lg: "48rpx",
    xl: "56rpx",
  }
  const iconSize = ICON_SIZE_MAP[size]

  const sizeClass = cn(
    size === "sm" && "py-sm",
    size === "md" && "py-md",
    size === "lg" && "py-lg",
    size === "xl" && "py-xl",
  )

  if (layout === "vertical") {
    return (
      <View
        className={cn("bg flex flex-col gap", sizeClass, className)}
        onClick={() => handleClick()}
      >
        <View className="flex items-center gap">
          {icon && (
            <Icon
              src={icon}
              style={{
                width: iconSize,
                height: iconSize,
              }}
            />
          )}
          {title}
        </View>
        {content != null && <View>{content}</View>}
      </View>
    )
  }

  return (
    <View
      className={cn(
        "flex items-center justify-between bg",
        sizeClass,
        className,
      )}
      onClick={() => handleClick()}
    >
      <View className="flex items-center gap">
        {icon && (
          <Icon
            src={icon}
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        )}
        {title}
      </View>
      <View className="flex items-center gap">
        {content && (<View>{content}</View>)}
        {!content && (to || onClick) && (
          <Icon
            src={ToIcon}
            style={{
              width: iconSize,
              height: iconSize,
            }}
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
  type?: "divided" | "underline" | "wrapped" | "plain"
  children?: ReactNode
}>) {
  const { isDark } = getTheme()

  return (
    <View
      className="flex flex-col"
      style={{
        backgroundColor: isDark ? "#303030" : "#f7f7f7",
        gap: type !== "plain" ? "2rpx" : "",
        paddingTop: type === "wrapped" ? "2rpx" : "",
        paddingBottom: type === "underline" || type === "wrapped" ? "2rpx" : "",
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
          layout={option.layout}
          className={option.className}
          onClick={option.onClick}
        />
      ))}
      {children}
    </View>
  )
}

export { Option, Options }
