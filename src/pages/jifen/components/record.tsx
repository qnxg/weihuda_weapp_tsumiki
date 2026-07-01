import type { JifenRecordItem } from "@/apis/models/jifen"
import { View } from "@tarojs/components"
import { useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import { useRequest } from "@/hooks/request"
import dayjs from "@/utils/dayjs"

export function Record({
  isScrollToLower,
  onRefetchFinish,
}: Readonly<{
  isScrollToLower: boolean
  onRefetchFinish: () => void
}>) {
  const [page, setPage] = useState(1)

  // 追踪上一次的 page 值, 用于区分首次挂载与后续触发
  const prevPageRef = useRef(page)

  // 保存最新 list 长度, 用于在 setList 前计算 hasMore
  const listLenRef = useRef(0)
  const [hasMore, setHasMore] = useState(true)

  const { data, isLoading } = useRequest(() => api.jifen.getRecord({ page }), [page])

  // 实际显示内容 (按页拼接)
  const [list, setList] = useState<JifenRecordItem[]>([])

  // 请求完成后追加到列表，并更新 hasMore
  useEffect(() => {
    if (isLoading || !data)
      return

    // 先计算新长度, 再同步到 ref
    const newListLen = listLenRef.current + data.records.length
    listLenRef.current = newListLen

    setList(p => [...p, ...data.records])
    setHasMore(newListLen < data.total)
  }, [data, isLoading])

  // 处理触底加载下一页
  useEffect(() => {
    // page 刚发生变化, 说明是触底触发, 立即重置标志并退出
    if (prevPageRef.current !== page) {
      prevPageRef.current = page
      onRefetchFinish()
      return
    }

    if (!isScrollToLower || isLoading || !hasMore)
      return

    setPage(p => p + 1)
  }, [isScrollToLower, isLoading, page, hasMore, onRefetchFinish])

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
                {dayjs(item.created_at).format("YYYY-MM-DD")}
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
