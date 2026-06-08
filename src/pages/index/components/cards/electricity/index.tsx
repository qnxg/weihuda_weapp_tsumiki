import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import ElectricityIcon from "@/static/index/electricity.svg"
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
    mockRequest({ roomNumber: "123", remaining: 1145.14 }, { errorRate: 0.2 }),
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
        icon={ElectricityIcon}
        title="宿舍电量"
        action="查看电量"
        to="/tools/pages/campus/electricity/index"
      />
      <IndexCardContent
        className="p flex items-center justify-between text-xl"
        isLoading={isLoading}
        isFailed={!data}
        onRefresh={refetch}
      >
        {data
          ? (
              <>
                <View>
                  宿舍号:
                  {" "}
                  {data.roomNumber}
                </View>
                <View>
                  剩余电量:
                  {" "}
                  {data.remaining}
                  度
                </View>
              </>
            )
          : (
              <>
                <Skeleton className="w-2xl" />
                <Skeleton className="w-2xl" />
              </>
            )}
      </IndexCardContent>
    </Card>
  )
}
