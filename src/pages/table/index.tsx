import type { CourseItem, CustomCourseRequest } from "@/apis/models/course"
import type { Status } from "@/hooks/cached-request"
import type { Semester } from "@/types/semester"
import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useMemo, useState } from "react"
import { api } from "@/apis"
import { Overlay } from "@/components/overlay"
import { Page } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { SETTINGS } from "@/config/setting"
import { useSemester } from "@/hooks/semester"
import { useSetting } from "@/hooks/setting"
import { CustomCourse } from "@/pages/table/components/custom-course"
import { DateHeader } from "@/pages/table/components/date-header"
import { Detail } from "@/pages/table/components/detail"
import { ExtraCourses } from "@/pages/table/components/extra-courses"
import { Menu } from "@/pages/table/components/menu"
import { Options } from "@/pages/table/components/options"
import { TableContent } from "@/pages/table/components/table-content"
import { TimeHeader } from "@/pages/table/components/time-header"
import { useCourse } from "@/pages/table/hooks/course"
import { colorCourses, formatCourses, getInitCells, mergeCells } from "@/pages/table/utils/course"
import { RequestError } from "@/types/request"
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

  // 删除自定义课程并刷新课程数据函数
  const handleDeleteCustomCourse = async (customize_id: number) => {
    if (customize_id === -1 || !semester)
      return

    try {
      await api.course.delete(customize_id, { xn: semester.xn, xq: semester.xq })
    }
    catch (error) {
      if (error instanceof RequestError) {
        await showToast({
          title: `删除失败: ${error.message}`,
          icon: "error",
        })
      }
    }
    finally {
      refetch()
    }
  }

  // 更新自定义课程并刷新课程数据函数
  const handleEditCustomCourse = async (customize_id: number | null, course: CustomCourseRequest) => {
    if (!semester)
      return

    try {
      if (customize_id) {
        await api.course.put(customize_id, {
          xn: semester.xn,
          xq: semester.xq,
          course,
        })
      }
      else {
        await api.course.post({
          xn: semester.xn,
          xq: semester.xq,
          course,
        })
      }
    }
    catch (error) {
      if (error instanceof RequestError) {
        await showToast({
          title: `${customize_id ? "更新" : "添加"}失败: ${error.message}`,
          icon: "error",
        })
      }
    }
    finally {
      refetch()
    }
  }

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
              onClose={() => {
                setActiveCell(null)
                setOverlayContentKey(null)
              }}
              onCustomDelete={(course) => {
                void handleDeleteCustomCourse(course.customize_id)
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
            <Options
              enable={!isUpdating}
              semester={semester ? { xn: semester.xn, xq: semester.xq } : { xn: 2025, xq: "spring" }}
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
          {overlayContentKey === "extra" && <ExtraCourses />}
          {overlayContentKey === "custom" && (
            <CustomCourse
              weeks={semester ? semester.weeks : 1}
              cell={activeCell}
              course={activeCustomCourse}
              onCancel={() => {
                setActiveCell(null)
                setActiveCustomCourse(null)
                setOverlayContentKey(null)
              }}
              onConfirm={(customize_id, course) => {
                void handleEditCustomCourse(customize_id, course)
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
