import { View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { useCallback, useState } from "react"
import { api } from "@/apis"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { PageContent } from "@/components/page"
import { useRequest } from "@/hooks/request"
import EmptyIcon from "@/static/tools/grade/ranking/empty.svg"
import { RankContent } from "@/tools/pages/grade/ranking/components/rank-content"
import { od } from "@/utils/ohday"

export function CA() {
  const [bootstrapped, setBootstrapped] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const onSettled = useCallback(() => {
    setBootstrapped(true)
  }, [])
  const { data, refetch, clearData } = useRequest(() => api.rank.ca.get(), [], {
    refetchClearData: false,
    onSettled,
  })

  // 触发后端重新生成数据
  const handleClick = () => {
    if (isUpdating)
      return

    setIsUpdating(true)
    void showLoading({
      title: "加载中...",
    })

    api.rank.ca.put()
      .then(() => {
        clearData()
      })
      .catch((err) => {
        switch (err.code) {
          case "NOT_SUPPORTED":
            void showToast({
              title: "暂不支持研究生",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: "更新失败",
              icon: "error",
            })
        }
      })
      .finally(() => {
        setIsUpdating(false)
        hideLoading()
      })
  }

  return (
    <PageContent
      isLoading={!bootstrapped}
      onRefresh={() => refetch()}
      className="h-full"
    >
      {data
        ? (
            <View className="flex flex-col gap p">
              <View className="flex items-center justify-between px">
                <View className="flex items-center">
                  最后更新于:
                  {" "}
                  {od(data.updated_at).p("YYYY-MM-DD HH:mm")}
                </View>
                <MyButton
                  active
                  disabled={isUpdating}
                  className="py-md px-2xl rounded-sm text-lg"
                  onClick={() => handleClick()}
                >
                  更新
                </MyButton>
              </View>

              <RankContent data={data.rank} />
            </View>
          )
        : (
            <View className="h-full flex flex-col center gap">
              <Icon className="size-l-lg" src={EmptyIcon} />
              <View>正在生成数据, 请稍后刷新查看</View>
            </View>
          )}
    </PageContent>
  )
}
