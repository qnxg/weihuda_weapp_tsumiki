import type { Status } from "@/hooks/cached-request"
import { View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { Page } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { useSemester } from "@/hooks/semester"
import { useSetting } from "@/hooks/setting"
import { DateHeader } from "@/pages/table/components/date-header"
import { Detail } from "@/pages/table/components/detail"
import { ExtraCourses } from "@/pages/table/components/extra-courses"
import { Menu } from "@/pages/table/components/menu"
import { Options } from "@/pages/table/components/options"
import { TableContent } from "@/pages/table/components/table-content"
import { TimeHeader } from "@/pages/table/components/time-header"
import { useCourse } from "@/pages/table/hooks/course"
import { getSemesterDateInfo, getSemesterName } from "@/utils/semester"

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
  const { isLoading: isSettingLoading } = useSetting()
  const { data: _course, status, isLoading: _isCourseLoading } = useCourse(semester)

  const isLoading = useMemo(() => (
    isSemesterLoading || isSettingLoading
  ), [isSemesterLoading, isSettingLoading])

  const [week, setWeek] = useState(1)

  // semester 初始化完成后写入初始周数
  useEffect(() => {
    if (semester) {
      const { week: newWeek } = getSemesterDateInfo(semester)
      setWeek(newWeek)
    }
  }, [semester])

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
            <TableContent />
          </View>
        </PullRefresh>
      </View>

      {/* 悬浮层 */}
      <Detail />

      {/* Popup 层 */}
      <Options />
      <ExtraCourses />

      {/* 绝对定位层 */}
      <Menu />
    </Page>
  )
}
