import type { BaseEventOrig, PickerMultiSelectorProps } from "@tarojs/components"
import type { CustomCourseRequest } from "@/apis/models/course"
import type { Cell, CourseItemWithColor } from "@/pages/table"
import type { RequestError } from "@/types/request"
import type { Semester } from "@/types/semester"
import { Input, Picker, View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { LABEL } from "@/config/logger-label"
import { logger } from "@/utils/logger"

const CUSTOM_COURSE_PICKER_RANGE = [
  ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  ["第 1 节", "第 2 节", "第 3 节", "第 4 节", "第 5 节", "第 6 节", "第 7 节", "第 8 节", "第 9 节", "第 10 节", "第 11 节", "第 12 节"],
  ["第 1 节", "第 2 节", "第 3 节", "第 4 节", "第 5 节", "第 6 节", "第 7 节", "第 8 节", "第 9 节", "第 10 节", "第 11 节", "第 12 节"],
]

export function CustomCourse({
  cell,
  course,
  weeks,
  semester,
  onCancel,
  onConfirm,
}: Readonly<{
  cell: Cell | null
  course: CourseItemWithColor | null
  weeks: number
  semester: Semester | null
  onCancel: () => void
  onConfirm: () => void
}>) {
  if (cell && course && !cell.items.includes(course)) {
    logger.error(LABEL.page.table.custom.INVALID_INDEX, `course: ${course.course_name}`)
  }

  const title = cell && course ? "编辑课程" : "添加课程"

  const initData = () => {
    if (cell && course) {
      const initTimes = Array.from({ length: cell.span }).map((_, i) => cell.start + i)

      return {
        course_name: course.course_name,
        weeks: course.weeks,
        day: cell.day,
        times: initTimes,
        place: course.place,
        teacher: course.teacher,
      }
    }

    return {
      course_name: "",
      weeks: [],
      day: 0,
      times: [1],
      place: "",
      teacher: "",
    }
  }

  // 表单值
  const [data, setData] = useState<CustomCourseRequest>(() => initData())

  // picker 值, 为 PICKER_RANGE 的数组索引
  const [picker, setPicker] = useState(() => ([
    data.day,
    Math.min(...data.times) - 1,
    Math.max(...data.times) - 1,
  ]))

  const [isPickerEditing, setIsPickerEditing] = useState(false)

  // 周全选
  const handleWeekSelectAll = () => {
    if (data.weeks.length === weeks) {
      setData(p => ({
        ...p,
        weeks: [],
      }))
    }
    else {
      setData(p => ({
        ...p,
        weeks: Array.from({ length: weeks }).map((_, i) => i + 1),
      }))
    }
  }

  // 单周
  const handleWeekSelectOdd = () => {
    setData(p => ({
      ...p,
      weeks: Array.from({ length: weeks }).map((_, i) => i + 1).filter(i => i % 2 === 1),
    }))
  }

  // 双周
  const handleWeekSelectEven = () => {
    setData(p => ({
      ...p,
      weeks: Array.from({ length: weeks }).map((_, i) => i + 1).filter(i => i % 2 === 0),
    }))
  }

  // Picker 选择器内部变化
  const handlePickerColumnChange = (e: BaseEventOrig<PickerMultiSelectorProps.ColumnChangeEventDetail>) => {
    setIsPickerEditing(true)

    const value = e.detail.value
    const column = e.detail.column
    const newPicker = [...picker]
    newPicker[column] = value

    // 保证第三列 >= 第二列, 且被修改方始终为主动方
    if (column === 1) {
      if (newPicker[1] > newPicker[2])
        newPicker[2] = newPicker[1]
    }
    else if (column === 2) {
      if (newPicker[2] < newPicker[1])
        newPicker[1] = newPicker[2]
    }

    setPicker(newPicker)
  }

  // 更新课程
  const handleConfirm = () => {
    if (!semester) {
      void showToast({
        title: "学期信息缺失",
        icon: "error",
      })
      return
    }

    if (!data.course_name || data.weeks.length === 0 || data.times.length === 0) {
      void showToast({
        title: "请填写必填项",
        icon: "error",
      })
      return
    }

    void showLoading({ title: "正在保存..." })
    Promise.resolve(() => {
      if (course) {
        return api.course.put(course.customize_id, {
          xn: semester.xn,
          xq: semester.xq,
          course: data,
        })
      }
      return api.course.post({
        xn: semester.xn,
        xq: semester.xq,
        course: data,
      })
    })
      .then(() => {
        hideLoading()
        onConfirm()
      })
      .catch((err: RequestError) => {
        hideLoading()

        switch (err.code) {
          case "SEMESTER_NOT_FOUND":
            void showToast({
              title: "学期不存在",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: `保存失败: ${err.message}`,
              icon: "error",
            })
        }
      })
  }

  // 当 picker 完成变化后, 更新 data 中的 day 和 times
  useEffect(() => {
    if (isPickerEditing)
      return

    const start = picker[1]
    const end = picker[2]
    const range = Array.from({ length: end - start + 1 }).map((_, i) => start + i + 1)
    setData(p => ({
      ...p,
      day: picker[0],
      times: range,
    }))
  }, [isPickerEditing, picker])

  return (
    <View className="h-full bg-page flex flex-col p gap">
      <View className="flex center p text-2xl text-bold">
        {title}
      </View>

      <Card>
        <CardContent className="p">
          <View className="flex items-center">
            <View className="w">课程*</View>
            <Input
              placeholder="请输入课程名称(必填)"
              className="flex-1"
              value={data.course_name}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  course_name: e.detail.value,
                }))
              }}
            />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="flex items-center">
            <View className="w">教师</View>
            <Input
              placeholder="请输入教师名称"
              className="flex-1"
              value={data.teacher}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  teacher: e.detail.value,
                }))
              }}
            />
          </View>

          <View className="flex items-center">
            <View className="w">教室</View>
            <Input
              placeholder="请输入教室位置"
              className="flex-1"
              value={data.place}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  place: e.detail.value,
                }))
              }}
            />
          </View>

        </CardContent>
      </Card>

      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="flex items-center">
            <View className="w">周次*</View>
            <View className="flex-1 flex flex-col gap">
              <View
                className="gap"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                }}
              >
                {Array.from({ length: weeks }).map((_, i) => (
                  <View
                    key={i}
                    className="flex center rounded-full"
                    style={{
                      width: "48rpx",
                      height: "48rpx",
                      // 同 primary
                      border: "2rpx solid #328ccb",
                      backgroundColor: data.weeks.includes(i + 1) ? "#328ccb" : "transparent",
                      color: data.weeks.includes(i + 1) ? "#ffffff" : "#328ccb",
                    }}
                    onClick={() => {
                      setData(p => ({
                        ...p,
                        weeks: p.weeks.includes(i + 1)
                          ? p.weeks.filter(w => w !== i + 1)
                          : [...p.weeks, i + 1].sort((a, b) => a - b),
                      }))
                    }}
                  >
                    {i + 1}
                  </View>
                ))}
              </View>
              <View className="flex items-center justify-between">
                <View
                  className="px py-xs bg-primary text-reverse rounded-full"
                  onClick={() => handleWeekSelectAll()}
                >
                  全选/全不选
                </View>
                <View
                  className="px py-xs bg-primary text-reverse rounded-full"
                  onClick={() => handleWeekSelectOdd()}
                >
                  单周
                </View>
                <View
                  className="px py-xs bg-primary text-reverse rounded-full"
                  onClick={() => handleWeekSelectEven()}
                >
                  双周
                </View>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="flex items-center">
            <View className="w">节次*</View>
            <View className="flex-1">
              <Picker
                range={CUSTOM_COURSE_PICKER_RANGE}
                value={picker}
                mode="multiSelector"
                onColumnChange={e => handlePickerColumnChange(e)}
                onChange={() => setIsPickerEditing(false)}
              >
                <View>
                  {CUSTOM_COURSE_PICKER_RANGE[0][picker[0]]}
                  {" "}
                  {CUSTOM_COURSE_PICKER_RANGE[1][picker[1]]}
                  -
                  {CUSTOM_COURSE_PICKER_RANGE[2][picker[2]]}
                </View>
              </Picker>
            </View>
          </View>
        </CardContent>
      </Card>

      <View className="flex">
        <MyButton
          active={false}
          className="flex-1 p flex center text-xl rounded-sm"
          onClick={() => onCancel()}
        >
          取消
        </MyButton>
        <MyButton
          active={true}
          className="flex-1 p flex center text-xl rounded-sm"
          onClick={() => handleConfirm()}
        >
          确认
        </MyButton>
      </View>
    </View>
  )
}
