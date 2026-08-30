import { View } from "@tarojs/components"
import { hideLoading, showLoading } from "@tarojs/taro"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Page, PageContent } from "@/components/page"
import { useMutation, useQuery } from "@/hooks/request"
import EmptyIcon from "@/static/tools/campus/electricity/empty.svg"
import { showModal } from "@/utils/modal"

export default function Electricity() {
  const {
    data: electricityData,
    isLoading: isElectricityLoading,
    refetch: electricityRefetch,
  } = useQuery(
    () => api.electricity.get(),
  )

  const {
    data: dormData,
    isLoading: dormLoading,
    refetch: dormRefetch,
  } = useQuery(
    () => api.dorm.get(),
  )

  const isLoading = isElectricityLoading || dormLoading

  const refetch = () => Promise.allSettled([
    electricityRefetch(),
    dormRefetch(),
  ])

  const { mutate, isPending } = useMutation(
    () => api.dorm.put(),
    {
      onMutate: () => {
        void showLoading({
          title: "更新中...",
        })
      },
      onSuccess: async () => {
        hideLoading()
        await refetch()
        showModal("宿舍信息已更新", "如宿舍信息有误或无法获取, 请前往\"我的/问题反馈\"上报问题")
      },
      onError: (err) => {
        hideLoading()
        switch (err.code) {
          case "DORM_NOT_FOUND":
            showModal("宿舍信息未找到", "请前往\"我的/问题反馈\"上报问题")
            break
          default:
            showModal("宿舍信息更新失败", "请前往\"我的/问题反馈\"上报问题")
        }
      },
    },
  )

  const handleClick = () => {
    if (isPending) {
      return
    }
    mutate()
  }

  return (
    <Page>
      <PageContent
        className="h-full"
        isLoading={isLoading && !electricityData && !dormData}
        onRefresh={() => refetch()}
      >
        {electricityData || dormData
          ? (
              <View className="flex flex-col p">
                {electricityData && (
                  <Card>
                    <CardContent className="flex flex-col gap">
                      <View className="text-highlight text-bold">当前电量</View>
                      <View className="flex items-end text-primary">
                        {electricityData.balance.at(-1) && electricityData.balance.at(-1) === "度"
                          ? (
                              <>
                                <View className="text-xl text-bold">{electricityData.balance.slice(0, -1)}</View>
                                度
                              </>
                            )
                          : electricityData.balance}
                      </View>
                    </CardContent>
                  </Card>
                )}

                {dormData && (
                  <Card>
                    <CardContent className="flex flex-col gap">
                      <View className="text-highlight text-bold">宿舍信息</View>
                      <View>
                        {dormData.park}
                        {dormData.build}
                        {" - "}
                        {dormData.room}
                      </View>
                      <MyButton
                        className="text-primary bg-transparent"
                        onClick={() => handleClick()}
                      >
                        宿舍信息有误?
                      </MyButton>
                    </CardContent>
                  </Card>
                )}
              </View>
            )
          : (
              <View className="h-full flex flex-col center gap py-xl">
                <Icon className="size-l-lg" src={EmptyIcon} />
                <View className="text-toned">未找到相关记录</View>
              </View>
            )}
      </PageContent>
    </Page>
  )
}
