import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { PageContent } from "@/components/page"
import { useRequest } from "@/hooks/request"
import { RankContent } from "@/tools/pages/grade/ranking/components/rank-content"
import dayjs from "@/utils/dayjs"
import { showModal } from "@/utils/modal"

export function CA() {
  const { data, isLoading, refetch } = useRequest(() => api.rank.ca.get(), [], {
    refetchClearData: false,
  })
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
      .finally(() => setIsUpdating(false))
  }

  return (
    <PageContent
      isLoading={isLoading && !data}
      onRefresh={() => refetch()}
      className="h-full"
    >
      <View className="flex flex-col gap p">
        <Card>
          <CardContent className="flex items-center justify-between">
            <View className="flex items-center">
              最后更新于:
              {" "}
              {data ? dayjs(data.updated_at).format("YYYY-MM-DD HH:mm") : "暂无数据"}
            </View>
            <MyButton
              active
              className="py-xs px-xl rounded-sm"
              onClick={() => handleClick()}
            >
              {data ? "更新" : "生成"}
            </MyButton>
          </CardContent>
        </Card>

        {data && <RankContent data={data.rank} />}
      </View>
    </PageContent>
  )
}
