import type { CourseItem } from "@/apis/models/course"
import type { Status } from "@/hooks/cached-request"
import type { Semester } from "@/types/semester"
import { View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { Overlay } from "@/components/overlay"
import { Page } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { SETTINGS } from "@/config/setting"
import { useSemester } from "@/hooks/semester"
import { useSetting } from "@/hooks/setting"
import { CourseOptions } from "@/pages/table/components/course-options"
import { CustomCourse } from "@/pages/table/components/custom-course"
import { DateHeader } from "@/pages/table/components/date-header"
import { Detail } from "@/pages/table/components/detail"
import { ExtraCourses } from "@/pages/table/components/extra-courses"
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

/**
 * @description 覆盖层内容类型
 *   - 课程详情
 *   - 设置
 *   - 查看额外课程
 *   - 自定义课程(新增/编辑)
 */
type OverlayContentKey = "detail" | "options" | "extra" | "custom"

const STATUS_TEXT: Record<Status, string> = {
  loading: "(加载中)",
  waiting: "(同步中)",
  updating: "(同步中)",
  success: "",
  cached: "(同步失败)",
  error: "(加载失败)",
}

export default function Table() {
  // 学期标识符
  const [displaySemester, setDisplaySemester] = useState<Semester | null>(null)

  const { data: semester, isLoading: isSemesterLoading } = useSemester(displaySemester ?? undefined)
  const { settings, isLoading: isSettingLoading, isUpdating, updateTableSetting } = useSetting()
  const { data: course, status, refetch } = useCourse(semester)

  const isLoading = useMemo(() => (
    isSemesterLoading || isSettingLoading
  ), [isSemesterLoading, isSettingLoading])

  // 当前周, 学期信息加载之前为 1, 和学期的空值搭配显示未本周
  const [week, setWeek] = useState(1)

  // 课表 cells, 共 7 个元素, 0 - 6 表示一周; 每个元素为一个 Cell 数组
  const [cells, setCells] = useState<Cell[][]>(() => getInitCells())

  // 覆盖层内容类型, null 表示不显示
  const [overlayContentKey, setOverlayContentKey] = useState<OverlayContentKey | null>(null)

  // 设置 Detail 组件显示信息
  const [activeCell, setActiveCell] = useState<Cell | null>(null)

  // 设置 CustomCourse 组件显示信息
  const [activeCustomCourse, setActiveCustomCourse] = useState<CourseItemWithColor | null>(null)

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
          {semester ? STATUS_TEXT[status] : "学期信息加载失败"}
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

        <PullRefresh
          onRefresh={() => {}}
          // 标题区: text-lg (28px) + py-xs (16px) = 44px
          // 日期头行: h-xs (80px) + py-xs (16px) = 96px
          topGap={140}
        >
          <View className="flex w-full">
            {/* 左侧时间头 */}
            {/* 纵向: h * 12 + gap-4rpx */}
            <TimeHeader />

            {/* 表格区 */}
            <TableContent
              week={week}
              cells={cells}
              onShowDetail={(cell) => {
                setActiveCell(cell)
                setOverlayContentKey("detail")
              }}
              onChangePrevWeek={() => {
                if (week <= 1)
                  return
                setWeek(p => p - 1)
              }}
              onChangeNextWeek={() => {
                if (!semester || week >= semester.weeks)
                  return
                setWeek(p => p + 1)
              }}
            />
          </View>
        </PullRefresh>
      </View>

      {/* 绝对定位层 */}
      <Menu
        onAddButtonClick={() => setOverlayContentKey("custom")}
        onOptionsButtonClick={() => setOverlayContentKey("options")}
        onExtraButtonClick={() => setOverlayContentKey("extra")}
      />

      {/* 覆盖层 */}
      {overlayContentKey && (
        <Overlay>
          {overlayContentKey === "detail" && activeCell && (
            <Detail
              cell={activeCell}
              week={week}
              semester={semester}
              onClose={() => {
                setActiveCell(null)
                setOverlayContentKey(null)
              }}
              onCustomDelete={() => {
                void refetch()
                setActiveCell(null)
                setOverlayContentKey(null)
              }}
              onCustomEdit={(course) => {
                setActiveCustomCourse(course)
                setOverlayContentKey("custom")
              }}
            />
          )}
          {overlayContentKey === "options" && (
            <CourseOptions
              enable={!isUpdating}
              semester={semester}
              week={week}
              weeks={semester ? semester.weeks : 1}
              tableSetting={settings.tableSetting ?? SETTINGS.tableSetting!}
              onSemesterChange={(semester) => {
                setDisplaySemester(semester)
              }}
              onWeekChange={(week) => {
                setWeek(week)
              }}
              onTableSettingChange={(setting) => {
                void updateTableSetting(setting)
              }}
              onClose={() => {
                setOverlayContentKey(null)
              }}
            />
          )}
          {overlayContentKey === "extra" && (
            <ExtraCourses
              semester={semester}
              onClose={() => {
                setOverlayContentKey(null)
              }}
            />
          )}
          {overlayContentKey === "custom" && (
            <CustomCourse
              weeks={semester ? semester.weeks : 1}
              cell={activeCell}
              course={activeCustomCourse}
              semester={semester}
              onCancel={() => {
                setActiveCell(null)
                setActiveCustomCourse(null)
                setOverlayContentKey(null)
              }}
              onConfirm={() => {
                void refetch()
                setActiveCell(null)
                setActiveCustomCourse(null)
                setOverlayContentKey(null)
              }}
            />
          )}
        </Overlay>
      )}
    </Page>
  )
}
