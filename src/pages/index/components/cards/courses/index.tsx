import type { CourseItem } from "@/apis/models/course"
import { View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { Skeleton } from "@/components/skeleton"
import { TabContent, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { SCHEDULES } from "@/config/schedule"
import { useCourse } from "@/hooks/course"
import { useSemester } from "@/hooks/semester"
import {
  formatCourses,
  mergeCourseCards,
} from "@/pages/index/components/cards/courses/utils/course"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import { IndexCardEmpty } from "@/pages/index/components/cards/index-card-empty"
import { useCardLoading } from "@/pages/index/hooks/card-loading"
import CoursesIcon from "@/static/index/courses.svg"
import EmptyIcon from "@/static/index/courses/empty.svg"
import { cn } from "@/utils/cn"
import dayjs from "@/utils/dayjs"
import { getSemesterDateInfo } from "@/utils/semester"
import "./index.scss"

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
 * @description 课程组件内容
 */
function CourseContent({
  cards,
  tab,
}: Readonly<{
  cards: CourseCard[] | null
  tab: TabValue
}>) {
  if (!cards)
    return <Skeleton className="w-full h" />

  if (cards.map(card => card.items).flat().length === 0) {
    return (
      <IndexCardEmpty
        icon={EmptyIcon}
        text={`${tab === "today" ? "今日" : "明日"}无课, 好好放松一下吧`}
      />
    )
  }

  return (
    <View className="w-full flex flex-col gap">
      {cards.map((card, index) => {
        if (card.items.length === 0)
          return null

        const start = SCHEDULES.find(s => s.index === card.start)?.start ?? ""
        const end = SCHEDULES.find(s => s.index === card.start + card.span - 1)?.end ?? ""

        const getStatus = () => {
          if (tab === "tomorrow")
            return "normal"

          if (dayjs().isBetween(start, end))
            return "doing"

          if (dayjs().isAfter(dayjs(end, "HH:mm"), "minute"))
            return "ended"

          // 对于已完成课程, 以下 diff 值为负值, 因此在已完成课程检测之后检测即将开始课程
          if (dayjs(start, "HH:mm").diff(dayjs(), "minute") <= 20)
            return "upcoming"

          return "normal"
        }

        const status = getStatus()

        // 处理潜在的课程重叠情况
        return card.items.map((course, i) => (
          <View
            key={`${card.start}-${index}-${i}`}
            className={cn("relative flex py-sm px-md gap rounded-sm overflow-hidden", `card--${status}`)}
            style={{
              // 二倍 px
              paddingLeft: "32rpx",
            }}
          >
            {/* 前置 header 装饰 */}
            <View
              className={cn("absolute", `header--${status}`)}
              style={{
                // 同 px-md
                width: "16rpx",
                height: "100%",
                left: "0",
                top: "0",
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
  const [cards, setCards] = useState<CourseCard[] | null>(null)

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
        isFailed={!course || !semester}
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
                  <TabTrigger asChild value="tomorrow">
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
            <CourseContent cards={cards} tab={tab} />
          </TabContent>
        </Tabs>
      </IndexCardContent>
    </Card>
  )
}
