import type { CustomScheduleRequest, ExamScheduleItem } from "@/apis/models/exam"
import { Input, Picker, View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import dayjs from "@/utils/dayjs"

export function Custom({
  exam,
  onCancel,
  onConfirm,
}: Readonly<{
  exam: ExamScheduleItem | null
  onCancel: () => void
  onConfirm: () => void
}>) {
  const title = exam ? "编辑考试内容" : "添加考试内容"

  // 表单值
  const [data, setData] = useState<CustomScheduleRequest>({
    course_name: exam?.course_name ?? "",
    area: exam?.area ?? "",
    classroom: exam?.classroom ?? "",
    date: exam?.date ?? dayjs().format("YYYY-MM-DD"),
    start_time: exam?.start_time ?? dayjs().format("HH:mm"),
    end_time: exam?.end_time ?? dayjs().format("HH:mm"),
    seat: exam?.seat ?? "",
  })

  const handleConfirm = () => {
    if (!data.course_name) {
      void showToast({
        title: "请填写必填项",
        icon: "error",
      })
    }

    void showLoading({ title: "保存中..." })
    const request = exam
      ? api.exam.put(exam.customize_id, data)
      : api.exam.post(data)
    request
      .then(() => {
        hideLoading()
        onConfirm()
      })
      .catch((err) => {
        hideLoading()

        switch (err.code) {
          case "EXAM_SCHEDULE_NOT_FOUND":
            void showToast({
              title: "考试安排不存在",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: "保存失败",
              icon: "error",
            })
        }
      })
  }

  return (
    <View className="h-full bg-page flex flex-col gap p">
      <View className="flex center p text-2xl text-bold">
        {title}
      </View>

      <Card>
        <CardContent className="p">
          <View className="flex items-center">
            <View className="w">名称*</View>
            <Input
              placeholder="请输入考试名称(必填)"
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
        <CardContent className="p">
          <View className="flex items-center">
            <View className="w">地点</View>
            <Input
              placeholder="请输入考试地点"
              className="flex-1"
              value={data.area}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  area: e.detail.value,
                }))
              }}
            />
          </View>

          <View className="flex items-center">
            <View className="w">考场</View>
            <Input
              placeholder="请输入考场位置"
              className="flex-1"
              value={data.classroom}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  classroom: e.detail.value,
                }))
              }}
            />
          </View>

          <View className="flex items-center">
            <View className="w">座位号</View>
            <Input
              placeholder="请输入座位号"
              className="flex-1"
              value={data.seat}
              onInput={(e) => {
                setData(p => ({
                  ...p,
                  seat: e.detail.value,
                }))
              }}
            />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="flex items-center">
            <View className="w">日期*</View>
            <View className="flex-1">
              <Picker
                mode="date"
                value={data.date}
                onChange={(e) => {
                  setData(p => ({
                    ...p,
                    date: e.detail.value,
                  }))
                }}
              >
                <View>{data.date}</View>
              </Picker>
            </View>
          </View>

          <View className="flex items-center">
            <View className="w">时间*</View>
            <View className="flex-1 flex gap">
              <Picker
                mode="time"
                value={data.start_time}
                onChange={(e) => {
                  setData(p => ({
                    ...p,
                    start_time: e.detail.value,
                  }))
                }}
              >
                <View>{data.start_time}</View>
              </Picker>

              <Picker
                mode="time"
                value={data.end_time}
                onChange={(e) => {
                  setData(p => ({
                    ...p,
                    end_time: e.detail.value,
                  }))
                }}
              >
                <View>{data.end_time}</View>
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
