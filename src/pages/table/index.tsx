import type { CourseItem } from "@/apis/models/course"
import type { Status } from "@/hooks/cached-request"
import { View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { Page } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { useSemester } from "@/hooks/semester"
import { useSetting } from "@/hooks/setting"
import { DateHeader } from "@/pages/table/components/date-header"
import { Menu } from "@/pages/table/components/menu"
import { TableContent } from "@/pages/table/components/table-content"
import { TimeHeader } from "@/pages/table/components/time-header"
import { useCourse } from "@/pages/table/hooks/course"
import { colorCourses, formatCourses, getInitCells, mergeCells } from "@/pages/table/utils/course"
import { getSemesterDateInfo, getSemesterName } from "@/utils/semester"

export type CourseItemWithColor = CourseItem & {
  bgColor: string
  color: string
}

/**
 * @description 课表页按天划分的每个单元格结构
 */
export interface Cell {
  day: number
  start: number
  span: number
  items: CourseItemWithColor[]
}

const STATUS_TEXT: Record<Status, string> = {
  loading: "(加载中)",
  waiting: "(同步中)",
  updating: "(同步中)",
  success: "",
  cached: "(同步失败)",
  error: "(加载失败)",
}

export default function Table() {
  const { data: semester, isLoading: isSemesterLoading } = useSemester()
  const { settings, isLoading: isSettingLoading } = useSetting()
  const { data: course, status, isLoading: _isCourseLoading } = useCourse(semester)

  const isLoading = useMemo(() => (
    isSemesterLoading || isSettingLoading
  ), [isSemesterLoading, isSettingLoading])

  // 当前周, 学期信息加载之前为 1, 和学期的空值搭配显示未本周
  const [week, setWeek] = useState(1)

  // 课表 cells, 共 7 个元素, 0 - 6 表示一周; 每个元素为一个 DayCell 数组
  const [cells, setCells] = useState<Cell[][]>(() => getInitCells())

  // semester 就绪后写入初始周数
  useEffect(() => {
    if (semester) {
      const { week: newWeek } = getSemesterDateInfo(semester)
      setWeek(newWeek)
    }
  }, [semester])

  // course 就绪后更新 cells
  useEffect(() => {
    if (course) {
      const coloredCourse = colorCourses(course)
      const initCells = formatCourses(coloredCourse.filter(
        // 是否显示非本周课程
        c => c.weeks.includes(week) || settings.tableSetting?.setting.displayNotCurrentWeekCourses,
      ))
      const newCells = mergeCells(initCells)
      setCells(newCells)
    }
  }, [course, week, settings.tableSetting])

  return (
    <Page isLoading={isLoading}>
      {/* 顶部标题区 */}
      <View className="w-full flex items-center justify-center text-lg py-xs">
        <View>
          {semester && `${getSemesterName(semester)} - 第${week}周`}
          {semester ? STATUS_TEXT[status] : "加载学期信息失败"}
        </View>
      </View>

      {/* 表格区 */}
      <View className="flex-1 flex flex-col overflow-hidden">
        <View className="w-full flex">
          {/* 左上角空白 */}
          <View className="w-xs" />

          {/* 顶部日期头 */}
          {/* 横向: w-full + justify-evenly + gap-4rpx */}
          <DateHeader start={semester?.start} week={week} />
        </View>

        <PullRefresh onRefresh={() => {}}>
          <View className="flex-1 flex w-full">
            {/* 左侧时间头 */}
            {/* 纵向: h * 12 + gap-4rpx */}
            <TimeHeader />

            {/* 表格区 */}
            <TableContent week={week} cells={cells} />
          </View>
        </PullRefresh>
      </View>

      {/* 绝对定位层 */}
      <Menu />
    </Page>
  )
}
