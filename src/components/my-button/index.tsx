import type { ButtonProps } from "@tarojs/components"
import type { ComponentProps, ReactNode } from "react"
import { Button as TaroButton, View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { navigate } from "@/utils/navigate"

/**
 * @description 带简单样式和原生按钮功能的自定义按钮组件
 * @example
 * 1. 基础用法: 直接当成 View 使用即可
 * 2. 按钮默认样式, 传入 boolean 的 active, 自动添加样式: true - 背景主色 文本反色, false - 背景透明 文本基础色
 * 3. 按钮功能: 导航与点击事件, 可以同时使用, 导航优先级更高
 * ```tsx
 * <MyButton to="/pages/path" />
 * <MyButton onClick={() => handleClick()} />
 * ```
 * 4. 原生按钮功能: 表单提交与微信开放能力, 直接传入属性即可
 * ```tsx
 * <MyButton formType="submit" />
 * <MyButton openType="getUserInfo" />
 * ```
 * 5. 按钮禁用: disabled 为 true, 将禁用按钮功能和原生按钮功能
 */
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
  active?: boolean | null // 按钮的激活状态, true表示激活, false表示非激活, null表示默认状态
  to?: string // 点击按钮后导航到的路径
  disabled?: boolean // 是否禁用按钮，默认为 false
  onClick?: () => void
  children?: ReactNode
  className?: string
  formType?: keyof ButtonProps.FormType // 按钮的表单触发事件, 参考 Taro Button 组件的 FormType 属性
  openType?: ButtonProps.OpenType // 按钮的微信开放能力, 参考 Taro Button 组件的 OpenType 属性
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
