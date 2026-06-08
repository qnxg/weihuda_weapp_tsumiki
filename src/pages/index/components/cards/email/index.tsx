import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useRequest } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import EmailIcon from "@/static/index/email.svg"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 校园邮箱
 */
export function Email({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data, isLoading, refetch } = useRequest(() =>
    mockRequest({ unreadCount: 42 }, { errorRate: 0.2 }),
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
        icon={EmailIcon}
        title="校园邮箱"
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
                您有
                {" "}
                {data.unreadCount}
                {" "}
                封未读邮件
              </View>
            )
          : <Skeleton className="w-full" />}
      </IndexCardContent>
    </Card>
  )
}
