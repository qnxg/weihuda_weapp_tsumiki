import type { GradeItem } from "@/apis/models/grade"
import type { Semester, XN, XQ } from "@/types/semester"
import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useGrade } from "@/hooks/grade"
import { useSemester } from "@/hooks/semester"
import { useUser } from "@/hooks/user"
import EmptyIcon from "@/static/tools/grade/grade/empty.svg"
import { Detail } from "@/tools/pages/grade/grade/components/detail"
import dayjs from "@/utils/dayjs"

export default function Grade() {
  const { user } = useUser()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  // Tab 值
  const [years, setYears] = useState<XN[]>([])
  const semesters: XQ[] = ["autumn", "spring", "summer"]

  // 选择值
  const [selectYear, setSelectYear] = useState<XN>(() => dayjs().year())
  const [selectSemester, setSelectSemester] = useState<XQ>("autumn")

  // 构造学期参数
  const gradeSemester = useMemo<Semester>(() => ({
    xn: selectYear,
    xq: selectSemester,
  }), [selectYear, selectSemester])

  const { data, refetch } = useGrade(gradeSemester)

  // 实际显示数组
  const [list, setList] = useState<GradeItem[]>([])

  // 详情显示内容
  const [jx0404id, setJX0404id] = useState<string | null>(null)

  // 查看详情
  const handleShowDetail = (jx0404id: string | null) => {
    if (!jx0404id) {
      void showToast({
        title: "暂无成绩详情",
        icon: "none",
      })
    }

    setJX0404id(jx0404id)
  }

  // data 变化时同步到 list
  useEffect(() => {
    if (data)
      setList(data)
  }, [data])

  // 用户和学期就绪后, 更新 Tab 值和初始值
  useEffect(() => {
    if (!user || !semester)
      return

    const enter = user.enter
    const now = semester.xn
    if (!enter || !now || enter > now)
      return

    const newYears = Array.from({ length: now - enter + 1 }).map((_, i) => enter + i as XN)
    setYears(newYears)
    setSelectYear(now)
    setSelectSemester(semester.xq)
  }, [user, semester])

  return (
    <Page isLoading={isSemesterLoading}>
      <Tabs value={selectYear}>
        <TabList>
          {years.map((year, index) => (
            <TabTrigger
              key={`${year}-${index}`}
              value={year}
              onClick={() => setSelectYear(year)}
            >
              {year}
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>
      <Tabs value={selectSemester}>
        <TabList>
          {semesters.map((semester, index) => (
            <TabTrigger
              key={`${semester}-${index}`}
              value={semester}
              onClick={() => setSelectSemester(semester)}
            >
              {semester === "autumn"
                ? "秋季学期"
                : semester === "spring" ? "春季学期" : "夏季学期"}
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>

      <PageContent>
        <PullRefresh onRefresh={async () => { await refetch() }}>
          <View className="h-full flex flex-col gap">
            {list.length === 0
              ? (
                  <View className="flex-1 flex flex-col center gap">
                    <Icon className="size-xl" src={EmptyIcon} />
                    <View>暂无成绩信息</View>

                    {/* 高度占位 */}
                    <View className="size-2xl" />
                  </View>
                )
              : (
                  <>
                    <View className="text-toned text-sm">点击可查看课程具体分数组成</View>
                    {list.map((item, index) => (
                      <Card
                        key={`${item.course_id}-${index}`}
                        onClick={() => handleShowDetail(item.jx0404id)}
                      >
                        <CardContent className="flex items-center justify-between">
                          <View className="flex flex-col">
                            <View className="flex flex-col">
                              <View className="text-lg">{item.course_name}</View>
                              <View className="text-toned text-sm">{item.course_id}</View>
                            </View>

                            <View className="flex py gap-xs">
                              {[item.course_type1, item.course_type2, item.grade_type, item.grade_tag].map((tag, index) => {
                                if (!tag)
                                  return null

                                return (
                                  <View
                                    key={`${item.course_id}-${tag}-${index}`}
                                    className="text-primary"
                                  >
                                    {tag}
                                  </View>
                                )
                              })}
                            </View>
                          </View>

                          <View className="h-full flex flex-col justify-evenly">
                            <View className="flex gap items-end">
                              <View className="text-xl">{item.score}</View>
                              <View>/</View>
                              <View>{item.gpa}</View>
                            </View>

                            <View className="text-toned text-sm">
                              学分:
                              {" "}
                              {item.credit}
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
          </View>
        </PullRefresh>
      </PageContent>

      {/* 覆盖层 */}
      {jx0404id && (
        <Overlay>
          <Detail
            jx0404id={jx0404id}
            onClose={() => setJX0404id(null)}
          />
        </Overlay>
      )}
    </Page>
  )
}
