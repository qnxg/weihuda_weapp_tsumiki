import { View } from "@tarojs/components"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Page, PageContent } from "@/components/page"
import { useRequest } from "@/hooks/request"
import DownloadIcon from "@/static/tools/campus/netflow-bill/download.svg"
import UploadIcon from "@/static/tools/campus/netflow-bill/upload.svg"
import EmptyIcon from "@/static/tools/campus/netflow-detail/empty.svg"
import dayjs from "@/utils/dayjs"

export default function NetflowBill() {
  const { data, isLoading, refetch } = useRequest(
    () => api.netflow.getOrder(),
    [],
    { refetchClearData: false },
  )

  return (
    <Page>
      <PageContent
        className="h-full"
        isLoading={isLoading && !data}
        onRefresh={refetch}
      >
        {data
          ? (
              <View className="flex flex-col gap p">
                {data.map((item, index) => (
                  <Card
                    key={`${item.year}-${item.month}-${index}`}
                  >
                    <CardContent className="flex flex-col gap">
                      <View className="flex items-center justify-between">
                        <View className="text-bold text-hightlight text-lg">
                          {item.year}
                          -
                          {item.month}
                        </View>
                        <View>
                          {item.amount}
                          元
                        </View>
                      </View>
                      <View className="flex items-center justify-between">
                        <View className="flex center">
                          {item.download}
                          <Icon
                            style={{
                              width: "48rpx",
                              height: "48rpx",
                            }}
                            src={DownloadIcon}
                          />
                        </View>
                        <View className="flex center">
                          {item.upload}
                          <Icon
                            style={{
                              width: "48rpx",
                              height: "48rpx",
                            }}
                            src={UploadIcon}
                          />
                        </View>
                        <View className="flex center">
                          超出:
                          {" "}
                          {item.over}
                        </View>
                      </View>
                      <View>
                        更新于:
                        {" "}
                        {dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                      </View>
                    </CardContent>
                  </Card>
                ))}
                <Card>
                  <CardContent className="flex center p-xs">
                    已经是最后一条了 ~
                  </CardContent>
                </Card>
              </View>
            )
          : (
              <View className="h-full flex flex-col center gap py-xl">
                <Icon className="size-xl" src={EmptyIcon} />
                <View className="text-toned">未找到相关记录</View>
              </View>
            )}
      </PageContent>
    </Page>
  )
}
