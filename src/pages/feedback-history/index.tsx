import type { FeedbackItem, FeedbackStatus } from "@/apis/models/feedback"
import { View } from "@tarojs/components"
import { previewImage } from "@tarojs/taro"
import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"
import { ENV } from "@/config/env"
import { useQuery } from "@/hooks/request"
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

const PAGE_SIZE = 20

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
  // 重载键, 变化时强制重新请求当前页; 下拉刷新与触底重试共用
  const [reloadKey, setReloadKey] = useState(0)

  // 成功加载到的页数, 仅在追加成功的 effect 中推进; 触底 effect 依据它决定下一页, 失败页不推进
  const loadedPagesRef = useRef(0)
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

  const { data, isLoading, isFetching, error } = useQuery(
    () => api.feedback.get({ page, size: PAGE_SIZE }),
    [page, reloadKey],
    {
      onSettled: handleRequestSettled,
    },
  )

  // 实际显示内容
  const [list, setList] = useState<FeedbackItem[]>([])

  // 请求成功后追加到列表, 并更新 hasMore
  useEffect(() => {
    if (isLoading || !data)
      return

    loadedPagesRef.current += 1
    const newListLen = listLenRef.current + data.items.length
    listLenRef.current = newListLen

    setList(p => [...p, ...data.items])
    setHasMore(newListLen < data.total)
  }, [data, isLoading])

  // 处理触底加载下一页
  useEffect(() => {
    // isFetching 覆盖翻页 / 重试 / 刷新的全部请求中状态, 防止并发触发
    if (!isScrollToLower || isFetching || !hasMore)
      return

    const target = loadedPagesRef.current + 1
    if (page !== target) {
      // page 落后于 target, 说明上次请求已成功: 前进到下一页
      setPage(target)
    }
    else if (error) {
      // page 已是目标页且上次请求失败: 重试同一页
      setReloadKey(k => k + 1)
    }

    // 触底标志消费后复位: 否则停留在底部时 effect 会随状态变化反复触发请求
    setIsScrollToLower(false)
  }, [isScrollToLower, isFetching, page, hasMore, error])

  // 下拉刷新, 复位分页计数并强制重新请求第一页, 刷新态在请求真正结束后由 onSettled 复位
  // 触底标志必须一并复位: 停留底部时标志悬挂为 true, 刷新后 effect 会带着旧标志直接翻到第 2 页, 丢失第 1 页数据
  const handleRefresh = () => {
    refreshingRef.current = true
    setIsRefreshing(true)
    setIsScrollToLower(false)
    loadedPagesRef.current = 0
    listLenRef.current = 0
    setList([])
    setHasMore(true)
    setPage(1)
    setReloadKey(k => k + 1)
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
                  {isFetching ? "加载中" : error ? "加载失败" : "暂无反馈记录"}
                </View>
              )
            : (
                <>
                  {list.map((item) => {
                    const src = imgSrc(item.img)
                    return (
                      <Card key={item.id}>
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

                          {src && (
                            <View
                              className="flex center bg-subtle rounded-sm p"
                              onClick={() => void previewImage({ urls: [src] })}
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
                    )
                  })}

                  {hasMore
                    ? (isFetching || error) && (
                        <View
                          className="flex center py-sm text-sm text-muted"
                          onClick={error ? () => setReloadKey(k => k + 1) : undefined}
                        >
                          {isFetching ? "加载中" : "加载失败, 点击重试"}
                        </View>
                      )
                    : <View className="flex center py-sm text-sm text-muted">没有更多了</View>}
                </>
              )}
        </View>
      </PageContent>
    </Page>
  )
}
