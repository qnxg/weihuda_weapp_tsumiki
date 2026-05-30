import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { useRequest } from "@/hooks/request"
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
    mockRequest({ tasks: 10 }),
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
      <CardContent className="p flex items-center justify-between text-xl">
        <View>
          近期任务:
          {" "}
          {data?.tasks}
        </View>
      </CardContent>
    </Card>
  )
}
