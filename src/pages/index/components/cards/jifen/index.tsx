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
    mockRequest({ points: 114514 }),
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
          { data
            ? (
                <View className="text-xl">
                  当前积分:
                  {" "}
                  {data.points}
                </View>
              )
            : <Skeleton className="w-xl" />}
        </View>
        {data && (
          <MyButton
            active={true}
            className="w-lg py-sm flex center rounded-sm"
          >
            签到
          </MyButton>
        )}
      </CardContent>
    </Card>
  )
}
