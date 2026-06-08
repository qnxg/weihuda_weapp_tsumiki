import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { cn } from "@/utils/cn"

export function IndexCardContent({
  children,
  className,
  isLoading,
  isFailed,
  message,
  onRefresh,
}: Readonly<{
  children: ReactNode
  className?: string
  isLoading: boolean
  isFailed: boolean
  message?: string
  onRefresh: () => void
}>) {
  return (
    <CardContent className={cn(!isLoading && isFailed ? "p flex flex-col items-center" : className)}>
      {!isLoading && isFailed
        ? (
            <>
              <View className="text-lg">{message ?? "加载失败"}</View>
              <MyButton
                className="py-sm bg-transparent text-primary flex center"
                onClick={onRefresh}
              >
                重试
              </MyButton>
            </>
          )
        : children}
    </CardContent>
  )
}
