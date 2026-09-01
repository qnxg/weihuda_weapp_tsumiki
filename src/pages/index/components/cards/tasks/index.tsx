import { View } from "@tarojs/components"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useQuery } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardRegistration } from "@/pages/index/hooks/card-loading"
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
  const { data, isLoading, refetch } = useQuery(() =>
    mockRequest({ tasks: 10 }, { errorRate: 0.2 }),
  )

  useCardRegistration(cardKey, refetch)

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
          : <Skeleton className="w-full h-l-sm" />}
      </IndexCardContent>
    </Card>
  )
}
