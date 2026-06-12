import type { JifenRecordItem } from "@/apis/models/jifen"
import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { useRequest } from "@/hooks/request"
import { useScrollContext } from "@/pages/jifen/contexts/scroll"
import dayjs from "@/utils/dayjs"

export function Record() {
  const { isScrollToLower, setIsScrollToLower } = useScrollContext()

  // 分页, 从 1 开始
  const [page, setPage] = useState(1)

  const { data, isLoading, refetch } = useRequest(() => api.jifen.getRecord({ page }))

  // 实际显示内容 (按页拼接)
  const [list, setList] = useState<JifenRecordItem[]>([])

  // 请求完成后拼接列表
  useEffect(() => {
    if (isLoading || !data)
      return

    // 仅页面匹配时才拼接列表
    if (data.page === page) {
      setList(p => [...p, ...data.records])
    }
  }, [data, isLoading, page])

  // 触底后触发请求
  useEffect(() => {
    if (!isScrollToLower || isLoading)
      return

    setPage(p => p + 1)
    refetch().finally(() => setIsScrollToLower(false))
  }, [isLoading, isScrollToLower, refetch, setIsScrollToLower])

  return (
    <View className="flex flex-col gap p">
      {list.length === 0
        ? <View className="h flex center text-lg">{isLoading ? "加载中" : "暂无记录"}</View>
        : list.map((item, index) => (
            <View
              key={`${item.id}-${index}`}
              className="flex items-center justify-between text-lg"
            >
              <View>
                {dayjs(item.create_at).format("YYYY-MM-DD")}
                {" "}
                {item.description}
              </View>
              <View className="text-primary">
                {item.jifen > 0 ? `+${item.jifen}` : item.jifen}
              </View>
            </View>
          ))}
    </View>
  )
}
