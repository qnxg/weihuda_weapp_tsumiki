import { View } from "@tarojs/components"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useQuery } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardRegistration } from "@/pages/index/hooks/card-loading"
import CampusIcon from "@/static/index/campus.svg"

/**
 * @description 校园卡余额
 */
export function CampusCard({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { data, isLoading, refetch } = useQuery(() => api.card.info())

  useCardRegistration(cardKey, refetch)

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
                <Skeleton className="w-l-xl" />
                <Skeleton className="w-l-xl" />
              </>
            )}
      </IndexCardContent>
    </Card>
  )
}
