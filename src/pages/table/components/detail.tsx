import type { Cell, CourseItemWithColor } from "@/pages/table"
import { ScrollView, Swiper, SwiperItem, View } from "@tarojs/components"

export function Detail({
  cell,
  week,
  onClose,
}: Readonly<{
  cell: Cell
  week: number
  onClose: () => void
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

  return (
    <View
      className="w-full h-full flex center bg-shadow"
      onClick={() => onClose()}
    >
      <Swiper
        className="w-full h-full"
        previousMargin="150rpx"
        nextMargin="150rpx"
      >
        {courses.map(course => (
          <SwiperItem
            key={course.course_name}
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
                  <View style={{
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
                </View>
              </ScrollView>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}
