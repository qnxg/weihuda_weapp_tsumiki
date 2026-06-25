import type { ExamScheduleItem } from "@/apis/models/exam"
import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { FONT_COLOR } from "@/config/color"
import EmptyIcon from "@/static/tools/exam/exam-arrange/empty.svg"
import MapPinIcon from "@/static/tools/exam/exam-arrange/map-pin.svg"

export function List({
  data,
  onShowDetail,
}: Readonly<{
  data: ExamScheduleItem[] | null
  onShowDetail: (item: ExamScheduleItem) => void
}>) {
  if (!data || data.length === 0) {
    return (
      <View className="h-full flex flex-col center gap py-xl">
        <Icon className="size-xl" src={EmptyIcon} />
        <View className="text-toned">暂无考试信息</View>
      </View>
    )
  }

  return (
    <View className="flex flex-col gap p">
      {data.map((item, index) => (
        <Card
          key={`${item.course_name}-${item.customize_id}-${index}`}
          onClick={() => onShowDetail(item)}
        >
          <CardContent className="flex items-center">
            <View className="flex flex-col items-center justify-center">
              <View className="text-lg">
                {item.date
                  ? item.date
                  : "无固定日期"}
              </View>
              {item.start_time && item.end_time && (
                <View className="text-sm">
                  {item.start_time}
                  {" - "}
                  {item.end_time}
                </View>
              )}
            </View>

            <View
              className="relative flex-1 flex flex-col justify-center"
              style={{
                // 为分割条留出空间
                marginLeft: "16rpx",
                paddingLeft: "16rpx",
              }}
            >
              {/* 中部分割条, 由于定位问题, 只能放到这里 */}
              <View
                className="absolute rounded-full"
                style={{
                  width: "8rpx",
                  height: "100%",
                  left: "0",
                  top: "0",
                  transform: "translateX(-50%)",
                  backgroundColor: FONT_COLOR[index % FONT_COLOR.length],
                }}
              />

              <View className="text-lg">{item.course_name}</View>
              <View className="text-muted text-sm">{item.course_id}</View>
              <View className="flex items-center gap text-toned text-sm">
                <View className="flex items-center">
                  <Icon
                    style={{
                      width: "24rpx",
                      height: "24rpx",
                    }}
                    src={MapPinIcon}
                  />
                  {item.area}
                </View>
                <View>{item.classroom}</View>
                <View>
                  座位号:
                  {" "}
                  {item.seat}
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}
