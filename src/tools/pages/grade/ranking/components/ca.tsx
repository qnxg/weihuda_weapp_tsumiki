import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { useRequest } from "@/hooks/request"
import { RankContent } from "@/tools/pages/grade/ranking/components/rank-content"
import dayjs from "@/utils/dayjs"
import { showModal } from "@/utils/modal"

export function CA({
  isRefreshing,
  onRefreshFinish,
}: Readonly<{
  isRefreshing: boolean
  onRefreshFinish: () => void
}>) {
  const { data, isLoading, refetch } = useRequest(() => api.rank.ca.get())
  const [isUpdating, setIsUpdating] = useState(false)

  // 更新成绩
  const handleClick = () => {
    if (isUpdating)
      return

    setIsUpdating(true)
    api.rank.ca.put()
      .then(() => {
        void showModal("成绩更新中", "正在生成数据, 请稍后刷新查看")
      })
      .catch((err) => {
        switch (err.code) {
          case "NOT_SUPPORTED":
            void showToast({
              title: "暂不支持研究生",
              icon: "none",
            })
            break
          default:
            void showToast({
              title: "更新失败",
              icon: "none",
            })
        }
      })
      .finally(() => setIsUpdating(false))
  }

  // 受控刷新
  useEffect(() => {
    if (!isRefreshing)
      return

    if (!data) {
      onRefreshFinish()
      return
    }

    refetch().finally(() => {
      onRefreshFinish()
    })
  }, [isRefreshing, data, onRefreshFinish, refetch])

  return (
    <View className="flex flex-col gap p">
      {isLoading && (
        <Card>
          <CardContent className="flex h center">加载中...</CardContent>
        </Card>
      )}
      {!isLoading && data && (
        <>
          <Card>
            <CardContent className="flex items-center justify-between">
              <View className="flex items-center">
                最后更新于:
                {" "}
                {dayjs(data.updated_at).format("YYYY-MM-DD HH:mm")}
              </View>
              <MyButton
                active
                className="py-xs px-xl rounded-sm"
                onClick={() => handleClick()}
              >
                更新
              </MyButton>
            </CardContent>
          </Card>

          <RankContent data={data.rank} />
        </>
      )}
    </View>
  )
}
