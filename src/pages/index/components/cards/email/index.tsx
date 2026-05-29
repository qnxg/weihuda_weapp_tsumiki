import { View } from "@tarojs/components"
import { useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/card"
import { useRequest } from "@/hooks/request"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
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
    mockRequest({ unreadCount: 42 }),
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
        title="校园邮箱"
      />
      <CardContent className="p flex items-center justify-between text-xl">
        <View>
          您有
          {" "}
          {data?.unreadCount}
          {" "}
          封未读邮件
        </View>
      </CardContent>
    </Card>
  )
}
