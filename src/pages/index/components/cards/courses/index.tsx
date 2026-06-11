import type { CourseItem } from "@/apis/models/course"
import { View } from "@tarojs/components"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardHeader } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { BG_COLOR, FONT_COLOR } from "@/config/color"
import { SCHEDULES } from "@/config/schedule"
import { useCourse } from "@/hooks/course"
import { useSemester } from "@/hooks/semester"
import {
  formatCourses,
  getInitCourseCards,
  mergeCourseCards,
} from "@/pages/index/components/cards/courses/utils/course"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import CoursesIcon from "@/static/index/courses.svg"
import dayjs from "@/utils/dayjs"
import { getSemesterDateInfo } from "@/utils/semester"

type TabValue = "today" | "tomorrow"

/**
 * @description 课程卡片展示的数据结构
 *   - 尽管一个时间理论上只有一节课, 但为了适应可能的课程重叠, 仍然将 course 定义为数组
 */
export interface CourseCard {
  start: number
  span: number
  items: CourseItem[]
}

/**
 * @description 课程
 */
export function Courses({
  cardKey,
}: Readonly<{
  cardKey: string
}>) {
  const { registerCard, onCardFinish } = useCardLoading()

  const { data: semester, isLoading: isSemesterLoading } = useSemester()
  const { data: course, isLoading: isCourseLoading, refetch } = useCourse(semester)

  const isLoading = useMemo(() => (
    isSemesterLoading || isCourseLoading
  ), [isSemesterLoading, isCourseLoading])

  const [tab, setTab] = useState<TabValue>("today")

  // 显示周
  const [week, setWeek] = useState(1)

  // 显示日
  const [day, setDay] = useState(0)

  // 课程卡片
  const [cards, setCards] = useState<CourseCard[]>(() => getInitCourseCards())

  // semester 就绪后按 tab 写入显示周和显示日
  useEffect(() => {
    if (semester) {
      const date = dayjs().add(tab === "today" ? 0 : 1, "day")
      const { week: newWeek } = getSemesterDateInfo(semester, date)
      setWeek(newWeek)
      setDay(date.day())
    }
  }, [semester, tab])

  // course 就绪后更新 cards
  useEffect(() => {
    if (course) {
      const todayCourse = course.filter(c => c.weeks.includes(week) && c.day === day)
      const initCards = formatCourses(todayCourse)
      const newCards = mergeCourseCards(initCards)
      setCards(newCards)
    }
  }, [course, day, week])

  useEffect(() => {
    registerCard(cardKey, refetch)
  }, [registerCard, refetch, cardKey])

  useEffect(() => {
    if (!isLoading) {
      onCardFinish(cardKey)
    }
  }, [isLoading, onCardFinish, cardKey])

  const Content = useCallback(() => {
    if (!course)
      return <Skeleton className="w-full h" />

    if (cards.length === 0) {
      return (
        <View>
          {tab === "today" ? "今日" : "明日"}
          无课
        </View>
      )
    }

    return (
      <View className="w-full flex flex-col gap">
        {cards.map((card, index) => {
          if (card.items.length === 0)
            return null

          const start = SCHEDULES.find(s => s.index === card.start)?.start ?? ""
          const end = SCHEDULES.find(s => s.index === card.start + card.span)?.end ?? ""

          const isComing = dayjs().diff(dayjs(start, "HH:mm"), "minute") <= 20

          // 今日课程才校验 isEnd, 明日课程 isEnd 始终为 false
          const isEnd = tab === "today" && dayjs().isAfter(dayjs(end, "HH:mm"), "minute")

          const bgColor = isComing
            ? BG_COLOR[4] // 黄色
            : isEnd
              ? "#efefef" // 灰色
              : BG_COLOR[0] // 蓝色

          const headColor = isComing
            ? FONT_COLOR[4]
            : isEnd
              ? "#aeaeae"
              : FONT_COLOR[0]

          // 处理潜在的课程重叠情况
          return card.items.map((course, i) => (
            <View
              key={`${card.start}-${index}-${i}`}
              className="relative flex py-sm px-md gap rounded-sm overflow-hidden"
              style={{
                backgroundColor: bgColor,
                // 二倍 px
                paddingLeft: "32rpx",
              }}
            >
              {/* 前置 header 装饰 */}
              <View
                className="absolute"
                style={{
                  // 同 px-md
                  width: "16rpx",
                  height: "100%",
                  left: "0",
                  top: "0",
                  backgroundColor: headColor,
                }}
              />

              <View className="size-xs flex flex-col gap-sm center">
                <View className="text-lg">{start}</View>
                <View>{end}</View>
              </View>
              <View className="h-xs flex-1 flex flex-col gap-sm justify-center">
                <View className="text-lg">{course.course_name}</View>
                <View>
                  第
                  {card.start}
                  -
                  {card.start + card.span - 1}
                  节
                  {" | "}
                  {course.place}
                  {" | "}
                  {course.teacher}
                </View>
              </View>
            </View>
          ))
        })}
      </View>
    )
  }, [cards, course, tab])

  return (
    <Card>
      <CardHeader
        icon={CoursesIcon}
        title="我的课程"
        action="更多"
        to="/pages/table/index"
      />
      <IndexCardContent
        className=""
        isLoading={isLoading}
        isFailed={!course}
        onRefresh={refetch}
      >
        <Tabs
          className="flex flex-col gap"
          value={tab}
        >
          {course
            ? (
                <TabList>
                  <TabTrigger asChild value="today">
                    <MyButton
                      className="flex-1 flex center rounded-sm"
                      active={tab === "today"}
                      onClick={() => setTab("today")}
                    >
                      今日
                    </MyButton>
                  </TabTrigger>
                  <TabTrigger asChild value="today">
                    <MyButton
                      className="flex-1 flex center rounded-sm"
                      active={tab === "tomorrow"}
                      onClick={() => setTab("tomorrow")}
                    >
                      明日
                    </MyButton>
                  </TabTrigger>
                </TabList>
              )
            : (
                <Skeleton
                  className="w-full"
                  style={{
                    height: "48rpx",
                  }}
                />
              )}
          <TabContent className="w-full py flex center">
            <Content />
          </TabContent>
        </Tabs>
      </IndexCardContent>
    </Card>
  )
}
