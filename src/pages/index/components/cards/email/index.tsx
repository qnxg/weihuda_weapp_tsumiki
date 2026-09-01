import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useQuery } from "@/hooks/request"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardRegistration } from "@/pages/index/hooks/card-loading"
import EmailIcon from "@/static/index/email.svg"

/**
 * @description 校园邮箱
 */
export function Email({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { data, isLoading, error, refetch } = useQuery(() => api.email.get())

  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isLoading)
      return

    if (error) {
      switch (error.code) {
        case "EMAIL_FETCH_FAILED":
          setMessage("查询失败, 请到\"个人门户/安全中心\"绑定邮箱")
          break
        default:
          setMessage("查询失败, 请稍后再试")
      }
    }

    if (data) {
      setMessage(data.count === 0 ? "暂无新邮件" : `您有 ${data.count} 封未读邮件`)
    }
  }, [data, isLoading, error])

  useCardRegistration(cardKey, refetch)

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
          ? <View>{message}</View>
          : <Skeleton className="w-full" />}
      </IndexCardContent>
    </Card>
  )
}
