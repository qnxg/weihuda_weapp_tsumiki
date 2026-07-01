import type { Semester } from "@/types/semester"
import { View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useEffect, useMemo } from "react"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"
import { useExtraCourse } from "@/hooks/course"

export function ExtraCourses({
  semester,
  onClose,
}: Readonly<{
  semester: Semester | null
  onClose: () => void
}>) {
  const { data, isLoading } = useExtraCourse(semester)

  const title = useMemo(() => `无课表课程${data && data.length > 0 ? `(${data.length})` : ""}`, [data])

  useEffect(() => {
    if (!semester) {
      void showToast({
        title: "学期信息缺失",
        icon: "error",
      })
      onClose()
    }
  }, [onClose, semester])

  return (
    <Popup
      isLoading={isLoading}
      onClose={onClose}
      title={title}
    >
      {data && data.length > 0 && (
        <View className="flex flex-col gap p">
          {data.map((course, index) => (
            <View
              key={`${course.course_name}_${index}`}
              className="py flex flex-col gap-sm rounded-sm"
            >
              <View className="text-xl bold">{course.course_name}</View>

              <Options
                type="underline"
                items={[
                  { title: "课程代码", content: course.course_id },
                  { title: "教师", content: course.teacher },
                  { title: "上课班级", content: course.class_name },
                  { title: "校区", content: course.area },
                  { title: "课程性质", content: course.course_type },
                  { title: "学分", content: course.credit },
                  { title: "人数", content: course.people },
                  { title: "备注", content: course.extra },
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </Popup>
  )
}
