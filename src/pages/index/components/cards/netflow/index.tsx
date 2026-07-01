import { View } from "@tarojs/components"
import { useEffect } from "react"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Icon } from "@/components/icon"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import DownloadIcon from "@/static/index/netflow/download.svg"
import UploadIcon from "@/static/index/netflow/upload.svg"
import NetflowIcon from "@/static/index/network.svg"
import { cn } from "@/utils/cn"

export function Netflow({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() => api.netflow.get())

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
        icon={NetflowIcon}
        title="本月流量"
        action="流量详情"
        to="/tools/pages/campus/netflow-detail/index"
      />
      <IndexCardContent
        className="p flex flex-col gap text-lg"
        isLoading={isLoading}
        isFailed={!data}
        onRefresh={refetch}
      >
        {data
          ? (
              <>
                <View className="flex items-center justify-between">
                  <View className="flex center">
                    {data.download}
                    <Icon
                      style={{
                        width: "48rpx",
                        height: "48rpx",
                      }}
                      src={DownloadIcon}
                    />
                  </View>
                  <View className="flex center">
                    {data.upload}
                    <Icon
                      style={{
                        width: "48rpx",
                        height: "48rpx",
                      }}
                      src={UploadIcon}
                    />
                  </View>
                  <View className={cn(data.is_locked ? "text-primary" : "text-toned")}>
                    {data.is_locked ? "已锁定" : "未锁定"}
                  </View>
                </View>
                <View className="flex items-center justify-between">
                  <View>
                    当前欠费:
                    {" "}
                    {data.overdue_payment}
                    元
                  </View>
                  <View>
                    超出流量:
                    {" "}
                    {data.extend_usage}
                    G
                  </View>
                </View>
                <View className="flex items-center justify-between">
                  <View className="w-xl">免费流量: </View>
                  <View
                    className="flex-1 rounded-full bg-page overflow-hidden"
                    style={{ height: "16rpx" }}
                  >
                    <View
                      className="h-full bg-primary"
                      style={{
                        width: `${data.base_percentage * 100}%`,
                      }}
                    />
                  </View>
                  <View className="w flex items-center justify-end text-toned">
                    {data.base_usage}
                    G
                  </View>
                </View>
              </>
            )
          : (
              <>
                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
                <Skeleton className="w-full" />
              </>
            )}
      </IndexCardContent>
    </Card>
  )
}
