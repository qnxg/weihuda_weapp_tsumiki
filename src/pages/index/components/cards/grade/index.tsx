import type { GradeItem } from "@/apis/models/grade"
import { View } from "@tarojs/components"
import { useMemo } from "react"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useGrade } from "@/hooks/grade"
import { useSemester } from "@/hooks/semester"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { IndexCardEmpty } from "@/pages/index/components/cards/index-card-empty"
import { useCardRegistration } from "@/pages/index/hooks/card-loading"
import GradeIcon from "@/static/index/grade.svg"
import EmptyIcon from "@/static/index/grade/empty.svg"

/**
 * @description 成绩组件内容
 */
function GradeContent({
  grade,
}: Readonly<{
  grade: GradeItem[] | null
}>) {
  if (!grade)
    return <Skeleton className="w-full" />

  if (grade.length === 0) {
    return <IndexCardEmpty icon={EmptyIcon} text="暂无成绩数据, 好好学习吧" />
  }

  return (
    <View className="w-full flex flex-col gap">
      {grade.map((item, index) => (
        <View
          key={`${item.course_name}-${index}`}
          className="flex items-center gap"
        >
          <View className="w-l-sm text-md ellipsis">{item.course_name}</View>
          <View className="flex-1 bg-page rounded-full overflow-hidden h-s-xs">
            <View
              className="h-full bg-primary"
              style={{
                width: `${item.score}%`,
              }}
            />
          </View>
          <View className="flex center text-md text-toned w-xl">{item.score}</View>
        </View>
      ))}
    </View>
  )
}

/**
 * @description 成绩查询
 */
export function Grade({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { data: semester, isLoading: isSemesterLoading } = useSemester()
  const { data: grade, isLoading: isGradeLoading, refetch } = useGrade(semester)

  const isLoading = useMemo(() => (
    isSemesterLoading || isGradeLoading
  ), [isSemesterLoading, isGradeLoading])

  useCardRegistration(cardKey, refetch)

  return (
    <Card>
      <CardHeader
        icon={GradeIcon}
        title="成绩查询"
        action="查看更多"
        to="/tools/pages/grade/grade/index"
      />
      <IndexCardContent
        className="p flex items-center justify-between text-xl"
        isLoading={isLoading}
        isFailed={!grade || grade.length === 0}
        onRefresh={refetch}
      >
        <GradeContent grade={grade} />
      </IndexCardContent>
    </Card>
  )
}
