import type {
  LabGradeRequest,
  LabSemester,
} from "@/apis/models/lab"
import type { XN } from "@/types/semester"
import { View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useAuth } from "@/hooks/auth"
import { useQuery } from "@/hooks/request"
import { useSemester } from "@/hooks/semester"
import EmptyIcon from "@/static/tools/grade/lab-grade/empty.svg"
import LabCard from "@/tools/pages/grade/lab-grade/components/lab-card"

export default function LabGrade() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  const [selectYear, setSelectYear] = useState<XN | null>(null)
  const [selectSemester, setSelectSemester] = useState<LabSemester | null>(null)

  const years = useMemo<XN[]>(() => {
    if (!semester)
      return []

    const enter = user?.enter
    if (!enter || enter > semester.xn)
      return [semester.xn]

    return Array.from(
      { length: semester.xn - enter + 1 },
      (_, index) => semester.xn - index as XN,
    )
  }, [semester, user])

  const gradeSemester = useMemo<LabGradeRequest | null>(() => {
    if (!semester || selectYear === null || selectSemester === null)
      return null

    return {
      xn: selectYear,
      xq: selectSemester,
    }
  }, [selectSemester, selectYear, semester])

  const { data, isPending, refetch } = useQuery(
    () => api.lab.grade(gradeSemester!),
    [gradeSemester?.xn, gradeSemester?.xq],
    { enabled: gradeSemester !== null },
  )

  useEffect(() => {
    if (!semester)
      return

    setSelectYear(semester.xn)
    setSelectSemester(
      semester.xq === "autumn" || semester.xq === "winter"
        ? "autumn"
        : "spring",
    )
  }, [semester])

  return (
    <Page
      isLoading={
        isSemesterLoading
        || isAuthLoading
        || (semester !== null && gradeSemester === null)
      }
    >
      <Tabs
        value={selectYear ?? undefined}
        onChange={value => setSelectYear(value as XN)}
      >
        <TabList>
          {years.map(year => (
            <TabTrigger key={year} value={year}>
              {year}
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>

      <Tabs
        value={selectSemester ?? undefined}
        onChange={value => setSelectSemester(value as LabSemester)}
      >
        <TabList>
          <TabTrigger value="autumn">秋季学期</TabTrigger>
          <TabTrigger value="spring">春季学期</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent
        className="h-full"
        isLoading={isPending && gradeSemester !== null && !data}
        onRefresh={refetch}
      >
        {data
          ? (
              <View className="p flex flex-col gap">
                <Card className="bg-primary text-reverse">
                  <CardContent className="flex flex-col gap-xs">
                    <View className="flex items-start justify-between gap">
                      <View
                        className="flex flex-col gap-xs"
                        style={{ minWidth: 0 }}
                      >
                        <View className="text-sm">课程</View>
                        <View className="text-xl text-bold">
                          {data.course_name}
                        </View>
                      </View>
                      <View
                        className="flex flex-col items-end gap-xs"
                        style={{ flexShrink: 0, maxWidth: "35%" }}
                      >
                        <View className="text-sm">总评</View>
                        <View className="text-3xl text-bold">
                          {data.course_score ?? "暂无"}
                        </View>
                      </View>
                    </View>
                    <View className="text-sm">{`共 ${data.labs.length} 项实验`}</View>
                  </CardContent>
                </Card>

                {data.labs.length === 0
                  ? (
                      <View className="flex flex-col center gap-sm py-3xl">
                        <View className="text-lg text-bold">暂无单项实验</View>
                        <View className="text-sm text-muted">课程暂未发布实验成绩</View>
                      </View>
                    )
                  : data.labs.map((item, index) => (
                      <LabCard
                        key={`${item.lab_name}-${index}`}
                        item={item}
                        index={index}
                      />
                    ))}
              </View>
            )
          : (
              <View className="h-full flex flex-col center gap">
                <Icon className="size-l-lg" src={EmptyIcon} />
                <View>暂无成绩信息</View>
              </View>
            )}
      </PageContent>
    </Page>
  )
}
