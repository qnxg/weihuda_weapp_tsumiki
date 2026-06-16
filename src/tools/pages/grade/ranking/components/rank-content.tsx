import type { Rank, RankDetail } from "@/apis/models/rank"
import { View } from "@tarojs/components"
import { Card, CardContent, CardTitle } from "@/components/card"

function RankRow({
  label,
  detail,
  field,
}: Readonly<{
  label: string
  detail: RankDetail | null
  field: "arithmetic" | "weighted" | "gpa"
}>) {
  const rankStr = detail?.[`${field}_rank`]
  const [rank, total] = rankStr?.split("/").map(Number) ?? []
  const percent = total ? `${((total - (rank ?? 0)) / total * 100).toFixed(2)}%` : undefined

  return (
    <View className="flex">
      <View className="flex-1 flex items-end gap">
        <View>
          {label}
          :
        </View>
        <View className="text-xl text-primary text-bold">{detail?.[field] ?? "-"}</View>
      </View>
      <View className="flex-1 flex items-end gap">
        <View>排名: </View>
        <View className="flex items-end">
          <View className="text-xl text-primary text-bold">{rank ?? "-"}</View>
          <View className="text-lg text-primary">
            /
            {total ?? "-"}
          </View>
          <View>
            (
            {percent ?? "-"}
            )
          </View>
        </View>
      </View>
    </View>
  )
}

function RankCard({
  title,
  detail,
}: Readonly<{
  title: string
  detail: RankDetail | null
}>) {
  return (
    <Card>
      <CardTitle>
        <View className="bold text-lg">{title}</View>
      </CardTitle>
      {detail
        ? (
            <CardContent className="flex flex-col gap">
              <RankRow label="算数平均分" detail={detail} field="arithmetic" />
              <RankRow label="加权平均分" detail={detail} field="weighted" />
              <RankRow label="绩点" detail={detail} field="gpa" />
            </CardContent>
          )
        : <CardContent className="h flex center">暂无数据</CardContent>}
    </Card>
  )
}

export function RankContent({
  data,
}: Readonly<{
  data: Rank
}>) {
  return (
    <>
      <RankCard title="全部课程" detail={data.all} />
      <RankCard title="必修课程" detail={data.compulsory} />
      <RankCard title="核心课程" detail={data.core} />
    </>
  )
}
