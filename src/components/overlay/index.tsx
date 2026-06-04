import type { ReactNode } from "react"
import { View } from "@tarojs/components"

export function Overlay({
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
