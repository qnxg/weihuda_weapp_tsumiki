import { View } from "@tarojs/components"
import { useCallback, useEffect, useMemo } from "react"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import ElectricityIcon from "@/static/index/electricity.svg"

/**
 * @description 电量
 */
export function Electricity({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data: dormData, isLoading: isDormLoading, refetch: dormRefetch } = useRequest(() => api.dorm.get())
  const { data: electricityData, isLoading: isElectricityLoading, refetch: electricityRefetch } = useRequest(() => api.electricity.get())

  const isLoading = useMemo(() => (
    isDormLoading || isElectricityLoading
  ), [isDormLoading, isElectricityLoading])

  const refetch = useCallback(() => {
    void dormRefetch()
    void electricityRefetch()
  }, [dormRefetch, electricityRefetch])

  const isFailed = useMemo(() => (
    !dormData || !electricityData
  ), [dormData, electricityData])

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
        isFailed={isFailed}
        onRefresh={refetch}
      >
        {!isFailed
          ? (
              <>
                <View>
                  宿舍号:
                  {" "}
                  {dormData!.room}
                </View>
                <View>
                  剩余电量:
                  {" "}
                  {electricityData!.info}
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
