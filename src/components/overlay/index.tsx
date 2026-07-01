import type { ReactNode } from "react"
import { ScrollView, View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { Icon } from "@/components/icon"
import CloseIcon from "@/static/common/close.svg"
import { cn } from "@/utils/cn"
import "./index.scss"

/**
 * @description 全屏遮罩层, 用于包裹弹窗内容
 * @example
 * ```tsx
 * <Overlay>
 *   {children}
 * </Overlay>
 * ```
 */
function Overlay({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View
      className="h-screen w-screen"
      style={{
        position: "fixed",
        zIndex: "9999",
      }}
    >
      {children}
    </View>
  )
}

/**
 * @description 遮罩层, 支持加载状态和位置控制
 * @example
 * ```tsx
 * <OverlayMask
 *   position="bottom"
 *   isLoading={isLoading}
 *   onClick={handleClose}
 * >
 *   {children}
 * </OverlayMask>
 * ```
 */
function OverlayMask({
  isLoading = false,
  children,
  position = "center",
  onClick,
}: Readonly<{
  isLoading?: boolean
  children: ReactNode
  position?: "top" | "center" | "bottom"
  onClick?: () => void
}>) {
  return (
    <View
      className={cn(
        "w-full h-full bg-shadow flex flex-col",
        position === "top" && "justify-start",
        position === "center" && "justify-center",
        position === "bottom" && "justify-end",
      )}
      onClick={() => onClick?.()}
    >
      {isLoading
        ? (
            <View className="w-full h-full flex center">
              <View
                className="relative size rounded-full spin"
                style={{
                  background: "conic-gradient(from 0deg, #222222, #aaaaaa)",
                  opacity: "0.5",
                }}
              >
                <View className="absolute inset-xs rounded-full bg" />
              </View>
            </View>
          )
        : children}
    </View>
  )
}

/**
 * @description 底部弹出式弹窗组件(需外层包裹 Overlay 使用)
 * @example
 * ```tsx
 * <Overlay>
 *   <Popup
 *     isLoading={isLoading}
 *     onClose={handleClose}
 *     title="标题"
 *   >
 *     {children}
 *   </Popup>
 * </Overlay>
 * ```
 */
function Popup({
  isLoading,
  onClose,
  title,
  children,
}: Readonly<{
  isLoading: boolean
  onClose: () => void
  title: string
  children: ReactNode
}>) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)

    setTimeout(() => {
      onClose()
    }, 200)
  }

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <OverlayMask
      position="bottom"
      isLoading={isLoading}
      onClick={() => handleClose()}
    >
      <View
        className="bg flex flex-col p overflow-hidden"
        style={{
          maxHeight: "80vh",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <View className="flex items-center justify-between p text-2xl text-bold">
          <View>{title}</View>
          <View onClick={() => handleClose()}>
            <Icon
              style={{
                width: "32rpx",
                height: "32rpx",
              }}
              src={CloseIcon}
            />
          </View>
        </View>

        <ScrollView
          className="flex-1 overflow-hidden"
          scrollY
          enhanced
          showScrollbar={false}
        >
          {children}
        </ScrollView>
      </View>
    </OverlayMask>
  )
}

export { Overlay, OverlayMask, Popup }
