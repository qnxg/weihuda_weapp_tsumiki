import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import TasksIcon from "@/static/index/tasks.svg"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 近期待办
 */
export function Tasks({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ tasks: 10 }, { errorRate: 0.2 }),
  )

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
        icon={TasksIcon}
        title="近期待办"
      />
      <IndexCardContent
        className="p flex items-center justify-between text-xl"
        isLoading={isLoading}
        isFailed={!data}
        onRefresh={refetch}
      >
        {data
          ? (
              <View>
                近期任务:
                {" "}
                {data.tasks}
              </View>
            )
          : <Skeleton className="w-full h" />}
      </IndexCardContent>
    </Card>
  )
}
