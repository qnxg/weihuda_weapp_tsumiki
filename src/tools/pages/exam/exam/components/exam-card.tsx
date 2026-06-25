import type { ExamScheduleItem } from "@/apis/models/exam"
import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import MapPinIcon from "@/static/tools/exam/exam-arrange/map-pin.svg"

export function ExamCard({
  exam,
  color,
  onClick,
}: Readonly<{
  exam: ExamScheduleItem
  color: string
  onClick: () => void
}>) {
  return (
    <Card onClick={onClick}>
      <CardContent className="flex items-center">
        <View className="flex flex-col items-center justify-center">
          <View className="text-lg">
            {exam.date
              ? exam.date
              : "无固定日期"}
          </View>
          {exam.start_time && exam.end_time && (
            <View className="text-sm">
              {exam.start_time}
              {" - "}
              {exam.end_time}
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
              backgroundColor: color,
            }}
          />

          <View className="text-lg">{exam.course_name}</View>
          <View className="text-muted text-sm">{exam.course_id}</View>
          <View className="flex items-center gap text-toned text-sm">
            <View className="flex items-center">
              <Icon
                style={{
                  width: "24rpx",
                  height: "24rpx",
                }}
                src={MapPinIcon}
              />
              {exam.area}
            </View>
            <View>{exam.classroom}</View>
            <View>
              座位号:
              {" "}
              {exam.seat}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
