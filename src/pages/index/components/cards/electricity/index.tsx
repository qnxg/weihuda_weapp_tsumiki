import { View } from "@tarojs/components"
import { useCallback, useMemo } from "react"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useQuery } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardRegistration } from "@/pages/index/hooks/card-loading"
import ElectricityIcon from "@/static/index/electricity.svg"

/**
 * @description 电量
 */
export function Electricity({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const {
    data: dormData,
    isLoading: isDormLoading,
    refetch: dormRefetch,
  } = useQuery(
    () => api.dorm.get(),
  )

  const {
    data: electricityData,
    isLoading: isElectricityLoading,
    refetch: electricityRefetch,
  } = useQuery(
    () => api.electricity.get(),
  )

  const isLoading = useMemo(() => (
    isDormLoading || isElectricityLoading
  ), [isDormLoading, isElectricityLoading])

  // allSettled 隔离单请求失败: 避免一个请求 reject 提前结束刷新等待, 也避免重试按钮点击产生无人接管的 rejection
  const refetch = useCallback(async () => {
    await Promise.allSettled([dormRefetch(), electricityRefetch()])
  }, [dormRefetch, electricityRefetch])

  const isFailed = useMemo(() => (
    !dormData || !electricityData
  ), [dormData, electricityData])

  useCardRegistration(cardKey, refetch)

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
                  {electricityData!.balance}
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
