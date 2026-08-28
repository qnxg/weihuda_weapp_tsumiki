import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { useMutation, useQuery } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import JifenIcon from "@/static/index/jifen.svg"
import { cn } from "@/utils/cn"

/**
 * @description 积分
 */
export function Jifen({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, unregisterCard } = useCardLoading()

  const { data, isLoading, refetch } = useQuery(() => api.jifen.get())

  const { mutate, isPending } = useMutation(
    () => api.jifen.post(),
    {
      onSuccess: () => {
        void showToast({
          title: "签到成功",
          icon: "success",
        })
        void refetch()
      },
      onError: (err) => {
        switch (err.code) {
          case "REPEATED_CHECK":
            void showToast({
              title: "已经签过了哦",
              icon: "success",
            })
            break
          default:
            void showToast({
              title: err.message || "签到失败",
              icon: "error",
            })
        }
      },
    },
  )

  const handleClick = () => {
    if (isPending) {
      return
    }
    mutate()
  }

  useEffect(() => {
    registerCard(cardKey, refetch)
    return () => unregisterCard(cardKey)
  }, [registerCard, unregisterCard, cardKey, refetch])

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <View className="flex items-center gap">
          <Icon
            className="size-sm"
            src={JifenIcon}
          />
          {isLoading
            ? <Skeleton className="w-l-lg" />
            : (
                <View className="text-xl">
                  当前积分:
                  {" "}
                  {data ? data.jifen : "加载失败"}
                </View>
              )}
        </View>
        {!isLoading && (
          data
            ? (
                <MyButton
                  className={cn(
                    "w-l-md py-sm flex center rounded-sm",
                    (isPending || data.is_checked) ? "bg-page text-base" : "bg-primary text-reverse",
                  )}
                  onClick={() => handleClick()}
                  disabled={isPending || data.is_checked}
                >
                  {isPending
                    ? "加载中..."
                    : data.is_checked ? "已签" : "签到"}
                </MyButton>
              )
            : (
                <MyButton
                  className="py-sm bg-transparent text-primary text-xl flex center"
                  onClick={() => refetch()}
                >
                  重试
                </MyButton>
              ))}
      </CardContent>
    </Card>
  )
}
