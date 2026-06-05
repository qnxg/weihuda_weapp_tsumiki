import type { Semester } from "@/types/semester"
import type { TableSetting } from "@/types/setting"
import { Picker, Switch, View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { Icon } from "@/components/icon"
import { LABEL } from "@/config/logger-label"
import { useUser } from "@/hooks/user"
import CloseIcon from "@/static/table/close.svg"
import { logger } from "@/utils/logger"
import { getPrevSemester, getSemesterFromName, getSemesterName } from "@/utils/semester"

export function Options({
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
  semester: Semester
  week: number
  weeks: number
  tableSetting: TableSetting
  onSemesterChange: (semester: Semester) => void
  onWeekChange: (week: number) => void
  onTableSettingChange: (setting: TableSetting) => void
  onClose: () => void
}>) {
  const { user } = useUser()

  // 根据当前学期和用户信息生成学期选择范围, 最多包含 20 个学期(防止死循环)
  const getPickerSemesterRange = () => {
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

  // 控制页面进入 / 移出动画
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)

    setTimeout(() => {
      onClose()
    }, 200)
  }

  // 应用 picker 变化
  useEffect(() => {
    onSemesterChange(getSemesterFromName(pickerSemesterRange[picker[0]])!)
    onWeekChange(picker[1] + 1)
  }, [onSemesterChange, onWeekChange, picker, pickerSemesterRange])

  // 初始挂载, 使用 setTimeout 宏任务防止在 transition 加载完成前 transform 变化
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View
      className="w-full h-full bg-shadow flex flex-col justify-end"
      onClick={() => handleClose()}
    >
      <View
        className="bg flex flex-col p-xl gap"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <View className="flex items-center justify-between text-2xl text-bold">
          <View>课表选项</View>
          <View onClick={() => handleClose()}>
            <Icon
              style={{
                width: "32rpx",
                height: "32rpx",
              }}
              src={CloseIcon}
            />
          </View>
        </View>

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
              onChange={(e) => {
                setPicker([
                  e.detail.value[0],
                  e.detail.value[1],
                ])
              }}
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
              onChange={() => {
                const newTableSetting = { ...tableSetting }
                newTableSetting.setting.displayNotCurrentWeekCourses = !tableSetting.setting!.displayNotCurrentWeekCourses
                onTableSettingChange(newTableSetting)
              }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
