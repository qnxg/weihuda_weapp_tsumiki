import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { Page } from "@/components/page"
import { PullRefresh } from "@/components/pull-refresh"
import { useSemester } from "@/hooks/semester"
import { DateHeader } from "@/pages/table/components/date-header"
import { Detail } from "@/pages/table/components/detail"
import { ExtraCourses } from "@/pages/table/components/extra-courses"
import { Menu } from "@/pages/table/components/menu"
import { Options } from "@/pages/table/components/options"
import { TableContent } from "@/pages/table/components/table-content"
import { TimeHeader } from "@/pages/table/components/time-header"
import { getSemesterDateInfo } from "@/utils/semester"

export default function Table() {
  const { data: semester } = useSemester()
  const [week, setWeek] = useState(1)

  // semester 初始化完成后写入初始周数
  useEffect(() => {
    if (semester) {
      const { week: newWeek } = getSemesterDateInfo(semester)
      setWeek(newWeek)
    }
  }, [semester])

  return (
    <Page>
      {/* 顶部标题区 */}
      <View className="w-full flex items-center justify-center text-lg py-xs">
        <View>我是标题</View>
      </View>

      {/* 表格区 */}
      <View className="flex-1 flex flex-col overflow-hidden">
        <View className="w-full flex">
          {/* 左上角空白 */}
          <View className="w-xs" />

          {/* 顶部日期头 */}
          {/* 横向: w-full + justify-evenly + gap-2xs */}
          <DateHeader start={semester?.start} week={week} />
        </View>

        <PullRefresh onRefresh={() => {}}>
          <View className="flex-1 flex w-full">
            {/* 左侧时间头 */}
            {/* 纵向: h * 12 + gap-2xs */}
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
