import type { ExamScheduleItem } from "@/apis/models/exam"
import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { hideToast, showToast } from "@tarojs/taro"
import { useState } from "react"
import { api } from "@/apis"
import { Option, Options } from "@/components/options"
import { Popup } from "@/components/overlay"
import EditIcon from "@/static/tools/exam/exam-arrange/edit.svg"
import TrashIcon from "@/static/tools/exam/exam-arrange/trash.svg"
import { showModal } from "@/utils/modal"

export function Detail({
  exam,
  onClose,
  onEdit,
  onDelete,
}: Readonly<{
  exam: ExamScheduleItem
  onClose: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}>) {
  const [isLoading, setIsLoading] = useState(false)

  const options: OptionItem[] = [
    { title: "课程名称", content: exam.course_name },
    { title: "课程编号", content: exam.course_id },
    { title: "考试日期", content: exam.date || "---" },
    { title: "考试时间", content: exam.start_time && exam.end_time ? `${exam.start_time} - ${exam.end_time}` : "---" },
    { title: "考试地点", content: exam.area && exam.classroom ? `${exam.area} ${exam.classroom}` : "---" },
    { title: "座位号", content: exam.seat || "---" },
  ]

  const handleDelete = async () => {
    if (isLoading)
      return

    setIsLoading(true)
    const res = await showModal("确认删除", `确认删除 ${exam.course_name} 的考试安排吗?`, "dangerous")

    if (res) {
      void showToast({
        title: "删除中...",
        icon: "loading",
      })
      api.exam.delete(exam.customize_id)
        .then(() => {
          hideToast()
          showToast({
            title: "已删除",
            icon: "success",
          })
        })
        .catch((err) => {
          switch (err.code) {
            case "EXAM_SCHEDULE_NOT_FOUND":
              showToast({
                title: "考试安排不存在",
                icon: "error",
              })
              break
            default:
              showToast({
                title: "删除失败",
                icon: "error",
              })
          }
        })
        .finally(() => {
          setIsLoading(false)
          onDelete(exam.customize_id)
        })
    }
    else {
      setIsLoading(false)
    }
  }

  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="考试详情"
    >
      <View className="flex flex-col gap p">
        <Options items={options} />

        {exam.customize_id !== -1 && (
          <Options>
            <Option
              icon={EditIcon}
              title="编辑"
              onClick={() => onEdit(exam.customize_id)}
            />
            <Option
              icon={TrashIcon}
              title="删除"
              onClick={() => handleDelete()}
            />
          </Options>
        )}
      </View>
    </Popup>
  )
}
