import type { GradeItem } from "@/apis/models/grade"
import type { Semester, XN, XQ } from "@/types/semester"
import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useMemo, useState } from "react"
import { Icon } from "@/components/icon"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useAuth } from "@/hooks/auth"
import { useGrade } from "@/hooks/grade"
import { useSemester } from "@/hooks/semester"
import EmptyIcon from "@/static/tools/grade/grade/empty.svg"
import { Detail } from "@/tools/pages/grade/grade/components/detail"
import { Tag } from "@/tools/pages/grade/grade/components/tag"
import { od } from "@/utils/ohday"

// 会被高亮的标签类型
const IMPORTANT_TYPE1 = ["必修"]
const IMPORTANT_TYPE2 = [
  "专业课",
  "专业基础",
  "学类核心",
  "学门核心",
  "专业核心",
]

export default function Grade() {
  const { user } = useAuth()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  // Tab 值
  const [years, setYears] = useState<XN[]>([])
  const semesters: XQ[] = ["autumn", "spring", "summer"]

  // 选择值
  const [selectYear, setSelectYear] = useState<XN>(() => od().year)
  const [selectSemester, setSelectSemester] = useState<XQ>("autumn")

  // 构造学期参数
  const gradeSemester = useMemo<Semester>(() => ({
    xn: selectYear,
    xq: selectSemester,
  }), [selectYear, selectSemester])

  // 获取成绩数据
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
        icon: "error",
      })
      return
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

    const newYears = Array.from({ length: now - enter + 1 }).map((_, i) => (now - i) as XN)
    setYears(newYears)
    setSelectYear(now)
    setSelectSemester(semester.xq === "winter" ? "autumn" : semester.xq)
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

      <PageContent
        className="h-full"
        onRefresh={refetch}
      >
        {list.length === 0
          ? (
              <View className="h-full flex flex-col center gap">
                <Icon className="size-xl" src={EmptyIcon} />
                <View>暂无成绩信息</View>
              </View>
            )
          : (
              <View className="p flex flex-col gap">
                <View className="text-toned text-sm">点击可查看课程具体分数组成</View>
                {list.map((item, index) => (
                  <View
                    key={`${item.course_id}-${index}`}
                    className="p-xl bg rounded-sm flex flex-col gap-sm"
                    onClick={() => handleShowDetail(item.jx0404id)}
                  >
                    {/* 课程名 + 成绩 */}
                    <View className="flex justify-between items-start">
                      <View
                        className="flex flex-col"
                        style={{ maxWidth: "80%" }}
                      >
                        <View className="text-xl">
                          {item.course_name}
                        </View>
                        <View className="text-sm text-muted">
                          {item.course_id}
                        </View>
                      </View>

                      <View className="flex items-end">
                        <View className="text-xl">
                          {item.score}
                        </View>
                        <View className="text-md">
                          {" "}
                          /
                          {" "}
                          {item.gpa == null ? "-" : item.gpa.toFixed(1)}
                        </View>
                      </View>
                    </View>

                    {/* 标签 + 学分 */}
                    <View className="flex justify-between items-center">
                      <View className="flex gap-xs">
                        {item.grade_tag && (
                          <Tag theme="warning">
                            {item.grade_tag}
                          </Tag>
                        )}
                        {item.course_type1 && (
                          <Tag
                            theme={IMPORTANT_TYPE1.includes(item.course_type1) ? "primary" : "default"}
                          >
                            {item.course_type1}
                          </Tag>
                        )}
                        {item.course_type2 && (
                          <Tag
                            theme={IMPORTANT_TYPE2.includes(item.course_type2) ? "primary" : "default"}
                          >
                            {item.course_type2}
                          </Tag>
                        )}
                      </View>

                      <View className="text-md text-muted">
                        学分:
                        {" "}
                        {item.credit}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
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
