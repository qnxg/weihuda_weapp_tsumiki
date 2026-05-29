import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 假期倒计时
 */
export function CountDown({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ type: "end", countDown: 42 }),
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
      <CardHeader
        title="假期倒计时"
      />
      <CardContent className="p flex items-center text-xl">
        <View>
          距离本学期
          {data?.type === "end" ? "结束" : "开始"}
          还有
        </View>
        <View className="flex items-center px gap">
          {data && String(data?.countDown).padStart(3, "0").split("").map((num, index) => (
            <View
              key={index}
              className="text-2xl text-hightlight text-bold p bg-page rounded-sm"
            >
              {num}
            </View>
          ))}
        </View>
        <View>
          天
        </View>
      </CardContent>
    </Card>
  )
}
