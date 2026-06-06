import type { Semester } from "@/types/semester"
import { ScrollView, View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import { Icon } from "@/components/icon"
import { OverlayMask } from "@/components/overlay"
import { STORAGE } from "@/config/storage-key"
import { useCachedRequest } from "@/hooks/cached-request"
import CloseIcon from "@/static/table/close.svg"

export function ExtraCourses({
  semester,
  onClose,
}: Readonly<{
  semester: Semester
  onClose: () => void
}>) {
  const { data, isLoading } = useCachedRequest(
    () => api.course.getExtra(semester),
    `${STORAGE.page.table.extra.prefix}_${semester.xn}_${semester.xq}`,
  )

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)

    setTimeout(() => {
      onClose()
    }, 200)
  }

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <OverlayMask
      position="bottom"
      isLoading={isLoading}
      onClick={() => handleClose()}
    >
      <View
        className="bg flex flex-col p-xl gap"
        style={{
          maxHeight: "80vh",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.2s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <ScrollView
          className="h-full"
          scrollY
          enhanced
          showScrollbar={false}
        >
          <View className="flex items-center justify-between text-2xl text-bold">
            <View>
              无课表课程
              {" "}
              {data && data.length > 0 && `(${data.length})`}
            </View>
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

          {data && data.length > 0 && (
            <View className="flex flex-col gap">
              {data.map((course, index) => (
                <View
                  key={`${course.course_name}_${index}`}
                  className="py flex flex-col gap-sm rounded-sm"
                >
                  <View className="text-xl">{course.course_name}</View>
                  <View className="flex items-center justify-between">
                    <View>课程代码</View>
                    <View>{course.course_id}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>教师</View>
                    <View>{course.teacher}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>上课班级</View>
                    <View>{course.class_name}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>校区</View>
                    <View>{course.area}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>课程性质</View>
                    <View>{course.type}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>学分</View>
                    <View>{course.credit}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>人数</View>
                    <View>{course.people}</View>
                  </View>
                  <View className="flex items-center justify-between">
                    <View>备注</View>
                    <View>{course.extra}</View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </OverlayMask>
  )
}
