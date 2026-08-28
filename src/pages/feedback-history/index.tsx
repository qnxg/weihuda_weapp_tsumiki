import type { FeedbackItem, FeedbackStatus } from "@/apis/models/feedback"
import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"
import { ENV } from "@/config/env"
import { useRequest } from "@/hooks/request"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"

/**
 * @description 反馈状态文案映射
 */
const STATUS_TEXT: Record<FeedbackStatus, string> = {
  pending: "待处理",
  working: "处理中",
  done: "已处理",
}

/**
 * @description 反馈状态颜色映射
 */
const STATUS_CLASS: Record<FeedbackStatus, string> = {
  pending: "text-warning",
  working: "text-primary",
  done: "text-success",
}

/**
 * @description 完整 URL 识别正则
 */
const FULL_URL_REGEX = /^https?:\/\//

/**
 * @description 拼接图片地址
 * - mock 返回完整 URL, 直接使用
 * - 真实环境返回图片 id, 拼接 BASE_URL + /img/{id}
 *
 * TODO: URL 处理
 */
function imgSrc(img: string | null): string | undefined {
  if (!img)
    return undefined
  return FULL_URL_REGEX.test(img) ? img : `${ENV.BASE_URL}/img/${img}`
}

/**
 * @description 反馈历史页, 展示当前用户提交的反馈列表, 支持下拉刷新与触底分页
 */
export default function FeedbackHistory() {
  const [isScrollToLower, setIsScrollToLower] = useState(false)

  // 当前请求页码
  const [page, setPage] = useState(1)
  // 下拉刷新触发键, 变化时强制重新请求第一页
  const [refreshKey, setRefreshKey] = useState(0)

  // 追踪上一次的 page 值, 用于区分首次挂载与后续触发
  const prevPageRef = useRef(page)
  // 保存最新 list 长度, 用于在 setList 前计算 hasMore
  const listLenRef = useRef(0)
  const [hasMore, setHasMore] = useState(true)

  // 是否处于下拉刷新中 (受控, 由请求真正结束时复位)
  const [isRefreshing, setIsRefreshing] = useState(false)
  // 标记当前请求是否由下拉刷新触发, 用于在请求结束后复位刷新态
  const refreshingRef = useRef(false)

  // 刷新触发的请求真正结束后才复位刷新态, 避免下拉动画提前结束
  const handleRequestSettled = useCallback(() => {
    if (refreshingRef.current) {
      refreshingRef.current = false
      setIsRefreshing(false)
    }
  }, [])

  const { data, isLoading } = useRequest(
    () => api.feedback.get({ page, size: 20 }),
    [page, refreshKey],
    {
      onSettled: handleRequestSettled,
    },
  )

  // 实际显示内容
  const [list, setList] = useState<FeedbackItem[]>([])

  // 请求完成后追加到列表, 并更新 hasMore
  useEffect(() => {
    if (isLoading || !data)
      return

    // 先计算新长度, 再同步到 ref
    const newListLen = listLenRef.current + data.items.length
    listLenRef.current = newListLen

    setList(p => [...p, ...data.items])
    setHasMore(newListLen < data.total)
  }, [data, isLoading])

  // 处理触底加载下一页
  useEffect(() => {
    // page 刚发生变化, 说明是触底触发, 立即重置标志并退出
    if (prevPageRef.current !== page) {
      prevPageRef.current = page
      setIsScrollToLower(false)
      return
    }

    if (!isScrollToLower || isLoading || !hasMore)
      return

    setPage(p => p + 1)
  }, [isScrollToLower, isLoading, page, hasMore])

  // 下拉刷新, 重置到第一页并强制重新请求, 刷新态在请求真正结束后由 onSettled 复位
  const handleRefresh = () => {
    refreshingRef.current = true
    setIsRefreshing(true)
    prevPageRef.current = 1
    listLenRef.current = 0
    setList([])
    setHasMore(true)
    setPage(1)
    setRefreshKey(k => k + 1)
  }

  return (
    <Page>
      <PageContent
        className="h-full"
        lowerThreshold={50}
        onScrollReached={() => setIsScrollToLower(true)}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      >
        <View className="flex flex-col gap p">
          {list.length === 0
            ? (
                <View className="h-l-sm flex center text-lg">
                  {isLoading ? "加载中" : "暂无反馈记录"}
                </View>
              )
            : list.map(item => (
                <Card key={`${item.id}`}>
                  <CardContent className="flex flex-col gap p">
                    <View className="text-lg">{item.description}</View>

                    <View className="flex items-center gap">
                      <View className={cn("text-sm", STATUS_CLASS[item.status])}>
                        {STATUS_TEXT[item.status]}
                      </View>
                      <View className="text-sm text-muted">
                        {od(item.created_at).p("YYYY-MM-DD HH:mm")}
                      </View>
                    </View>

                    {item.img && imgSrc(item.img) && (
                      <View
                        className="flex center bg-subtle rounded-sm p"
                        onClick={() => void Taro.previewImage({ urls: [imgSrc(item.img) ?? ""] })}
                      >
                        <View className="text-sm text-primary">查看图片</View>
                      </View>
                    )}

                    {item.replies.length > 0 && (
                      <View className="flex flex-col gap-xs">
                        <View className="text-sm text-muted">处理结果</View>
                        <View className="text-toned">{item.replies.at(-1)?.msg}</View>
                      </View>
                    )}
                  </CardContent>
                </Card>
              ))}
        </View>
      </PageContent>
    </Page>
  )
}
