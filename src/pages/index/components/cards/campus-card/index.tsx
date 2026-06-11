import { View } from "@tarojs/components"
import { useEffect } from "react"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import CampusIcon from "@/static/index/campus.svg"

/**
 * @description 校园卡余额
 */
export function CampusCard({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() => api.card.info())

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
                  卡号:
                  {" "}
                  {data.id}
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
      </IndexCardContent>
    </Card>
  )
}
