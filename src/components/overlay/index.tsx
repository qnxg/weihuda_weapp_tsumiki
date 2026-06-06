import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import "./index.scss"

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

export { Overlay, OverlayMask }
