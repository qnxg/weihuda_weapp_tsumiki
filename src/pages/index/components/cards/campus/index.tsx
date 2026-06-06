import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import CampusIcon from "@/static/index/campus.svg"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 校园卡余额
 */
export function Campus({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ cardNumber: "114514", balance: 114.5 }),
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
        icon={CampusIcon}
        title="校园卡余额"
        action="查看账单"
        to="/tools/pages/campus/card-bill/index"
      />
      <CardContent className="p flex items-center justify-between text-xl">
        {data
          ? (
              <>
                <View>
                  卡号:
                  {" "}
                  {data.cardNumber}
                </View>
                <View>
                  余额:
                  {" "}
                  {data.balance}
                </View>
              </>
            )
          : (
              <>
                <Skeleton className="w-2xl" />
                <Skeleton className="w-2xl" />
              </>
            )}
      </CardContent>
    </Card>
  )
}
