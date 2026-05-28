import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 电量
 */
export function Electricity({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ roomNumber: "123", remaining: 1145.14 }),
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
        title="宿舍电量"
        action="查看电量"
      />
      <CardContent className="p flex items-center justify-between text-xl">
        <View>
          宿舍号:
          {" "}
          {data?.roomNumber}
        </View>
        <View>
          剩余电量:
          {" "}
          {data?.remaining}
          度
        </View>
      </CardContent>
    </Card>
  )
}
