import type { Semester } from "@/types/semester"
import type { TableSetting } from "@/types/setting"
import { Picker, Switch, View } from "@tarojs/components"
import { useState } from "react"
import { Popup } from "@/components/overlay"
import { LABEL } from "@/config/logger-label"
import { useAuth } from "@/hooks/auth"
import { logger } from "@/utils/logger"
import { getPrevSemester, getSemesterFromName, getSemesterName } from "@/utils/semester"

export function CourseOptions({
  enable,
  semester,
  week,
  weeks,
  tableSetting,
  onSemesterChange,
  onWeekChange,
  onTableSettingChange,
  onClose,
}: Readonly<{
  enable: boolean
  semester: Semester | null
  week: number
  weeks: number
  tableSetting: TableSetting
  onSemesterChange: (semester: Semester) => void
  onWeekChange: (week: number) => void
  onTableSettingChange: (setting: TableSetting) => void
  onClose: () => void
}>) {
  const { user } = useAuth()

  // 根据当前学期和用户信息生成学期选择范围, 最多包含 20 个学期(防止死循环)
  const getPickerSemesterRange = () => {
    if (!semester)
      return ["学期信息缺失"]

    if (!user)
      return [getSemesterName(semester)]

    // 倒序得到学期数组
    const semesters = [semester]

    // 防止死循环
    for (let times = 0; times <= 100; times++) {
      const prev = getPrevSemester(semesters.at(-1)!)
      semesters.push(prev)

      if (prev.xn === user.enter && prev.xq === "autumn")
        break

      times += 1
      if (times === 100) {
        logger.error(LABEL.page.table.options.SEMESTER_NOT_ACCESSIBLE, `semester: ${JSON.stringify(semester)}`)
      }
    }
    return semesters.map(s => getSemesterName(s))
  }

  const pickerSemesterRange: string[] = getPickerSemesterRange()
  const pickerWeekRange: string[] = Array.from({ length: weeks }).map((_, i) => `${i + 1}`)
  const pickerRange = [pickerSemesterRange, pickerWeekRange]

  // 用于学期 / 星期的 Picker 组件
  const [picker, setPicker] = useState([0, week - 1])

  // 应用 picker 变化
  const handlePickerChange = () => {
    if (!semester)
      return

    const newSemester = getSemesterFromName(pickerSemesterRange[picker[0]])
    if (newSemester)
      onSemesterChange(newSemester!)

    onWeekChange(picker[1] + 1)
  }

  // 应用 setting 变化
  const handleSettingChange = () => {
    const newTableSetting = { ...tableSetting }
    newTableSetting.setting.displayNotCurrentWeekCourses = !tableSetting.setting!.displayNotCurrentWeekCourses
    onTableSettingChange(newTableSetting)
  }

  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="课表选项"
    >
      <View className="flex flex-col p gap">
        <View className="flex items-center justify-between">
          <View>当前信息: </View>
          <View>
            <Picker
              disabled={!enable}
              range={pickerRange}
              value={picker}
              mode="multiSelector"
              onColumnChange={(e) => {
                const newPicker = [...picker]
                newPicker[e.detail.column] = e.detail.value
                setPicker(newPicker)
              }}
              onChange={() => handlePickerChange()}
            >
              <View>
                {pickerSemesterRange[picker[0]]}
                {" "}
                第
                {" "}
                {pickerWeekRange[picker[1]]}
                {" "}
                周
              </View>
            </Picker>
          </View>
        </View>

        <View className="flex items-center justify-between">
          <View>显示非本周课程: </View>
          <View>
            <Switch
            // 同 primary
              color="#328ccb"
              controlled="true"
              style={{
                transform: "scale(0.8)",
              }}
              checked={tableSetting.setting!.displayNotCurrentWeekCourses}
              disabled={!enable}
              onChange={() => handleSettingChange()}
            />
          </View>
        </View>
      </View>
    </Popup>
  )
}
