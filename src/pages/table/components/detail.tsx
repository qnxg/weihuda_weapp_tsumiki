import type { Cell, CourseItemWithColor } from "@/pages/table"
import type { RequestError } from "@/types/request"
import type { Semester } from "@/types/semester"
import { ScrollView, Swiper, SwiperItem, View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { api } from "@/apis"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { OverlayMask } from "@/components/overlay"
import EditIcon from "@/static/table/edit.svg"
import TrashIcon from "@/static/table/trash.svg"

export function Detail({
  cell,
  week,
  onClose,
  semester,
  onCustomDelete,
  onCustomEdit,
}: Readonly<{
  cell: Cell
  week: number
  semester: Semester | null
  onClose: () => void
  onCustomDelete: () => void
  onCustomEdit: (course: CourseItemWithColor) => void
}>) {
  // 将当前周的课程放在前面, 其他周的课程放在后面
  const currentWeekCourses: CourseItemWithColor[] = []
  const notCurrentWeekCourses: CourseItemWithColor[] = []

  cell.items.forEach((i) => {
    if (i.weeks.includes(week)) {
      currentWeekCourses.push(i)
      return
    }
    notCurrentWeekCourses.push(i)
  })

  const courses = [...currentWeekCourses, ...notCurrentWeekCourses]

  const handleDelete = (course: CourseItemWithColor) => {
    if (!semester) {
      void showToast({
        title: "学期信息加载失败, 无法删除课程",
        icon: "error",
      })
      return
    }

    if (course.customize_id === -1)
      return

    void showLoading({ title: "加载中..." })
    api.course.delete(course.customize_id, { xn: semester.xn, xq: semester.xq })
      .then(() => {
        hideLoading()
        onCustomDelete()
      })
      .catch((err: RequestError) => {
        hideLoading()

        switch (err.code) {
          case "SEMESTER_NOT_FOUND":
            void showToast({
              title: "学期信息未找到, 无法删除课程",
              icon: "error",
            })
            break
          case "COURSE_NOT_FOUND":
            void showToast({
              title: "课程信息未找到, 可能已被删除",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: `删除失败: ${err.message}`,
              icon: "error",
            })
        }
      })
  }

  return (
    <OverlayMask
      position="center"
      onClick={() => onClose()}
    >
      <Swiper
        className="w-full h-full"
        previousMargin="150rpx"
        nextMargin="150rpx"
      >
        {courses.map((course, index) => (
          <SwiperItem
            key={`${course.course_name}_${index}`}
            className="w-screen h-full"
          >
            {/* 详情卡片 */}
            <View
              className="px py-sm rounded-sm text-reverse text-lg"
              style={{
                width: "360rpx",
                left: "55rpx",
                right: "55rpx",
                top: "200rpx",
                bottom: "200rpx",
                position: "absolute",
                // 此处文本较浅, 背景色使用原前景色
                backgroundColor: course.weeks.includes(week) ? course.color : "#aeaeae",
              }}
              // 阻断事件冒泡, 卡片内点击不关闭详情
              onClick={e => e.stopPropagation()}
            >
              <ScrollView
                className="h-full"
                scrollY
                enhanced
                showScrollbar={false}
              >
                <View className="p flex flex-col gap">
                  <View className="flex flex-col">
                    <View>{course.type}</View>
                    <View>{course.course_id}</View>
                  </View>

                  <View
                    style={{
                    // 同 2 被 text-2xl
                      fontSize: "48rpx",
                    }}
                  >
                    {course.course_name}
                  </View>

                  <View className="flex flex-col gap-sm">
                    {(course.place || course.area) && (
                      <View>
                        {course.place}
                        {course.area ? `(${course.area})` : ""}
                      </View>
                    )}
                    <View>{course.class_name}</View>
                    <View>{course.teacher}</View>
                    {course.weeks.length > 0 && (
                      <View>
                        第
                        {course.weeks.join(", ")}
                        {" "}
                        周
                      </View>
                    )}
                    {course.credit && (
                      <View>
                        {course.credit}
                        学分
                      </View>
                    )}
                    {course.people && (
                      <View>
                        上课人数:
                        {" "}
                        {course.people}
                      </View>
                    )}
                    <View>
                      {course.extra}
                    </View>
                  </View>

                  {course.customize_id !== -1 && (
                    <View
                      className="absolute flex flex-col items-center gap-xs"
                      style={{
                        color: "#000000",
                        // 同 m-md
                        bottom: "20rpx",
                        left: "0",
                        right: "0",
                      }}
                    >
                      <MyButton
                        className="flex center gap-sm px py-xs rounded-sm"
                        style={{
                          // 同 text-reverse
                          backgroundColor: "#ffffff",
                        }}
                        onClick={() => handleDelete(course)}
                      >
                        <Icon
                          theme="light"
                          src={TrashIcon}
                          style={{
                            width: "32rpx",
                            height: "32rpx",
                          }}
                        />
                        <View>删除</View>
                      </MyButton>
                      <MyButton
                        className="flex center gap-sm px py-xs rounded-sm"
                        style={{
                          // 同 text-reverse
                          backgroundColor: "#ffffff",
                        }}
                        onClick={() => onCustomEdit(course)}
                      >
                        <Icon
                          theme="light"
                          src={EditIcon}
                          style={{
                            width: "32rpx",
                            height: "32rpx",
                          }}
                        />
                        <View>编辑</View>
                      </MyButton>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </OverlayMask>
  )
}
