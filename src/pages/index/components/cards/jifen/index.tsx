import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
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
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() => api.jifen.get())

  const [isChecking, setIsChecking] = useState(false)

  const handleClick = () => {
    if (isChecking)
      return

    setIsChecking(true)

    api.jifen.post()
      .then(() => {
        void showToast({
          title: "签到成功",
          icon: "success",
        })
        void refetch()
      })
      .catch((err) => {
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
      })
      .finally(() => setIsChecking(false))
  }

  useEffect(() => {
    registerCard(cardKey, refetch)
  }, [registerCard, refetch, cardKey])

  useEffect(() => {
    if (!isLoading) {
      onCardFinish(cardKey)
    }
  }, [isLoading, onCardFinish, cardKey])

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <View className="flex items-center gap">
          <Icon
            style={{
              width: "48rpx",
              height: "48rpx",
            }}
            src={JifenIcon}
          />
          {isLoading
            ? <Skeleton className="w-xl" />
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
                    "w-lg py-sm flex center rounded-sm",
                    (isChecking || data.is_checked) ? "bg-page text-base" : "bg-primary text-reverse",
                  )}
                  onClick={() => handleClick()}
                  disabled={isChecking || data.is_checked}
                >
                  {isChecking
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
