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
      <View
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto 1fr",
        }}
      >
        {/* 左上角空白 */}
        <View />

        {/* 顶部日期头 */}
        <DateHeader start={semester?.start} week={week} />

        {/* 左侧时间头 */}
        <TimeHeader />

        {/* 表格区 */}
        {/* 横向: w-fill + 7 个元素 justify-evenly */}
        {/* 纵向: 12 个元素 h-xs + gap */}
        <PullRefresh onRefresh={() => {}}>
          <TableContent />
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
