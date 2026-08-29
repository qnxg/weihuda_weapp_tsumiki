import type { OptionItem } from "@/components/options"
import type { XN } from "@/types/semester"
import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { Options } from "@/components/options"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { FONT_COLOR } from "@/config/color"
import { useAuth } from "@/hooks/auth"
import { useRequest } from "@/hooks/request"
import { useSemester } from "@/hooks/semester"
import EmptyIcon from "@/static/tools/grade/physical-grade/empty.svg"
import { Eye } from "@/tools/pages/grade/physical-grade/components/eye"
import { formatPhysicalGrade } from "@/tools/pages/grade/physical-grade/utils/physical-grade"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"

/**
 * @description 用于构成条和卡片展示的内容
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
  const { user } = useAuth()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  // Tab 值
  const [years, setYears] = useState<XN[]>([])
  const [selectYear, setSelectYear] = useState<XN>(() => od().year)

  // 获取成绩数据
  const { data, refetch } = useRequest(() => api.gym.grade({
    xn: selectYear,
  }), [selectYear], {
    refetchClearData: false,
  })

  // 实际展示内容
  const [list, setList] = useState<PhysicalGradeItem[]>([])

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

    const newYears = Array.from({ length: now - enter + 1 }).map((_, i) => now - i as XN)
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
      >
        {data
          ? (
              <View className="flex flex-col gap p">
                <Card>
                  <CardContent className="flex flex-col gap">
                    <View className="flex items-end justify-between">
                      <View className="flex flex-col gap-sm">
                        <View className="text-toned">总成绩</View>
                        <View className="text-2xl text-bold">{data.score}</View>
                      </View>
                      {data.grade && (
                        <View className="text-2xl text-bold">
                          {data.grade}
                        </View>
                      )}
                    </View>
                    <View className="flex rounded-full bg-page overflow-hidden h-s-xl">
                      {list.map((item, index) => (
                        <View
                          key={`${item.name}-${index}`}
                          className="h-full"
                          style={{
                            backgroundColor: FONT_COLOR[index]!,
                            width: `${item.percentage * item.score / 100}%`,
                          }}
                        />
                      ))}
                    </View>

                    <Options
                      items={[
                        {
                          title: "类型",
                          content: data.report_type || "--",
                        },
                        {
                          title: "状态",
                          content: data.report_status || "--",
                        },
                        {
                          title: "描述",
                          content: data.report_description || "--",
                        },
                      ].map<OptionItem>(item => ({
                        title: (
                          <View
                            className="text-toned"
                            style={{ flexShrink: 0 }}
                          >
                            {item.title}
                          </View>
                        ),
                        content: (
                          <View style={{ textAlign: "right", minWidth: 0 }}>
                            {item.content}
                          </View>
                        ),
                        size: "lg",
                        className: "gap text-lg",
                      }))}
                      type="divided"
                    />
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
                      className="relative overflow-hidden"
                      style={{
                        paddingLeft: "24rpx",
                      }}
                    >
                      <View
                        className="absolute h-full"
                        style={{
                          width: "8rpx",
                          left: "0",
                          top: "0",
                          backgroundColor: FONT_COLOR[index]!,
                        }}
                      />
                      <CardContent className="flex flex-col gap-sm">
                        <View className="flex items-center justify-between">
                          <View className="text-bold text-lg">{item.name}</View>
                          <View
                            className={cn(
                              "text-reverse text-sm py-xs px rounded-full",
                              item.color === "red" ? "bg-danger" : "bg-success",
                            )}
                          >
                            {item.rank}
                          </View>
                        </View>
                        <View className="text-sm text-toned">
                          {`${item.grade} / ${item.score} 分 (占 ${item.percentage}%)`}
                        </View>
                      </CardContent>
                    </Card>
                  ))}

                  <Card onClick={() => setShowEye(true)}>
                    <CardContent className="flex flex-col gap-sm">
                      <View className="text-bold text-lg">视力</View>
                      <View className="text-sm text-toned">点击查看</View>
                    </CardContent>
                  </Card>
                </View>
              </View>
            )
          : (
              <View className="h-full flex flex-col center gap">
                <Icon className="size-l-lg" src={EmptyIcon} />
                <View>信息加载失败</View>
              </View>
            )}
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
