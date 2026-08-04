import type { Rank, RankDetail } from "@/apis/models/rank"
import { View } from "@tarojs/components"
import { Card, CardContent, CardTitle } from "@/components/card"

/**
 * @description 解析排名字符串 "排名/总人数", 两部分均为整数才算成功
 * @returns 解析成功返回 `{ rank, total, percent }`, 失败返回 `null`
 * - rank: 当前排名
 * - total: 总人数
 * - percent: 排名百分比文案, 如 "95.00%"
 */
function parseRank(rankStr: string | null | undefined) {
  if (!rankStr)
    return null

  const [rankPart, totalPart, ...rest] = rankStr.split("/")
  if (!rankPart || !totalPart || rest.length > 0)
    return null

  const rank = Number(rankPart)
  const total = Number(totalPart)
  if (!Number.isInteger(rank) || !Number.isInteger(total) || total <= 0)
    return null

  return {
    rank,
    total,
    percent: `${((total - rank) / total * 100).toFixed(2)}%`,
  }
}

function RankRow({
  label,
  detail,
  field,
}: Readonly<{
  label: string
  detail: RankDetail
  field: "arithmetic" | "weighted" | "gpa"
}>) {
  const grade = (detail[field] != null && field === "gpa") ? Number(detail[field]).toFixed(1) : detail[field]
  const rankInfo = parseRank(detail?.[`${field}_rank`])

  if (!grade && !rankInfo)
    return null

  return (
    <View className="flex">
      {grade && (
        <View className="flex-1 flex items-end gap">
          <View>
            {label}
            :
          </View>
          <View className="text-xl text-primary text-bold">{grade}</View>
        </View>
      )}
      {rankInfo && (
        <View className="flex-1 flex items-end gap">
          <View>排名: </View>
          <View className="flex items-end">
            <View className="text-xl text-primary text-bold">{rankInfo.rank}</View>
            <View className="text-lg text-primary">
              /
              {rankInfo.total}
            </View>
            {/** 小程序往往会丢掉文本节点开头的普通空格, 改成不换行空格更稳妥. */}
            <View>{`\u00A0(${rankInfo.percent})`}</View>
          </View>
        </View>
      )}
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
