import type { XN } from "@/types/semester"
import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { FONT_COLOR } from "@/config/color"
import { useRequest } from "@/hooks/request"
import { useSemester } from "@/hooks/semester"
import { useUser } from "@/hooks/user"
import { Eye } from "@/tools/pages/grade/physical-grade/components/eye"
import { formatPhysicalGrade } from "@/tools/pages/grade/physical-grade/utils/physical-grade"
import dayjs from "@/utils/dayjs"

/**
 * @description 用于轴和卡片展示的内容
 */
export interface PhysicalGradeItem {
  name: string
  color: string
  percentage: number
  rank: string
  grade: string
  score: number
}

export default function PhysicalGrade() {
  const { user } = useUser()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  // Tab 值
  const [years, setYears] = useState<XN[]>([])
  const [selectYear, setSelectYear] = useState<XN>(() => dayjs().year())

  // 获取成绩数据
  const { data, refetch } = useRequest(() => api.gym.grade({
    xn: selectYear,
  }), [selectYear])

  // 实际展示内容
  const [list, setList] = useState<PhysicalGradeItem[]>([])

  // 活跃展示内容
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // 展示视力内容
  const [showEye, setShowEye] = useState(false)

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
  }, [user, semester])

  // data 变化时同步到 list
  useEffect(() => {
    if (!data || !semester || !user)
      return

    const newList = formatPhysicalGrade(data, user.sex)
    setList(newList)
  }, [data, semester, user])

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

      <PageContent
        className="h-full"
        onRefresh={() => refetch()}
        onClick={() => setActiveIndex(null)}
      >
        {data
          ? (
              <View className="flex flex-col gap p">
                <Card>
                  <CardContent className="flex flex-col gap-sm">
                    <View className="flex justify-between">
                      <View className="flex flex-col gap-sm">
                        <View>{user?.name ?? "---"}</View>
                        <View>
                          总得分:
                          {" "}
                          {data.score}
                          {data.grade && ` (${data.grade})`}
                        </View>
                      </View>

                      {/* 显示 active 项目 */}
                      {activeIndex !== null && (
                        <View className="flex flex-col gap-sm">
                          <View style={{
                            color: FONT_COLOR[activeIndex]!,
                          }}
                          >
                            {list[activeIndex]!.name}
                          </View>
                          <View>
                            占比:
                            {" "}
                            {list[activeIndex]!.percentage}
                            %
                            {" "}
                            得分:
                            {" "}
                            {list[activeIndex]!.score}
                          </View>
                        </View>
                      )}
                    </View>
                    <View
                      className="flex rounded-full bg-page overflow-hidden"
                      style={{
                        height: "16rpx",
                      }}
                    >
                      {list.map((item, index) => (
                        <View
                          key={`${item.name}-${index}`}
                          className="h-full"
                          style={{
                            backgroundColor: FONT_COLOR[index]!,
                            width: `${item.percentage * item.score / 100}%`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveIndex(index)
                          }}
                        />
                      ))}
                    </View>
                    <View className="text-toned">点击上方彩色条查看具体成绩</View>
                  </CardContent>
                </Card>

                <View
                  className="gap"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}
                >
                  {list.map((item, index) => (
                    <Card
                      key={`${item.name}-${index}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveIndex(index)
                      }}
                    >
                      <CardContent className="flex flex-col gap-sm">
                        <View className="flex items-center justify-between">
                          <View className="text-bold text-lg">{item.name}</View>
                          <View
                            className="text-reverse text-sm py-xs px rounded-full"
                            style={{
                              backgroundColor: item.color === "red" ? "#dd0000" : "#00aa00",
                            }}
                          >
                            {item.rank}
                          </View>
                        </View>
                        <View className="text-sm">{item.grade}</View>
                      </CardContent>
                    </Card>
                  ))}

                  <Card onClick={() => setShowEye(true)}>
                    <CardContent className="flex flex-col gap-sm">
                      <View className="text-bold text-lg">视力</View>
                      <View className="text-sm">点击查看</View>
                    </CardContent>
                  </Card>
                </View>
              </View>
            )
          : <View className="h flex center">加载中...</View>}
      </PageContent>

      {data && showEye && (
        <Overlay>
          <Eye
            data={data.eye}
            onClose={() => setShowEye(false)}
          />
        </Overlay>
      )}
    </Page>
  )
}
