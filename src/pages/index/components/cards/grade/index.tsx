import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import GradeIcon from "@/static/index/grade.svg"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 成绩查询
 */
export function Grade({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ score: 100 }),
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
        icon={GradeIcon}
        title="成绩查询"
        action="查看更多"
        to="/tools/pages/grade/grade/index"
      />
      <CardContent className="p flex items-center justify-between text-xl">
        {data
          ? (
              <View>
                成绩:
                {" "}
                {data.score}
              </View>
            )
          : <Skeleton className="w-full" />}
      </CardContent>
    </Card>
  )
}
