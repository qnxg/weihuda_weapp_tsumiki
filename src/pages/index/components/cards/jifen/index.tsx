import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import JifenIcon from "@/static/index/jifen.svg"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 积分
 */
export function Jifen({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ points: 114514 }, { errorRate: 0.2 }),
  )

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
                  {data ? data.points : "加载失败"}
                </View>
              )}
        </View>
        {!isLoading && (
          data
            ? (
                <MyButton
                  active={true}
                  className="w-lg py-sm flex center rounded-sm"
                >
                  签到
                </MyButton>
              )
            : (
                <MyButton
                  className="py-sm bg-transparent text-primary text-xl flex center"
                >
                  重试
                </MyButton>
              ))}
      </CardContent>
    </Card>
  )
}
