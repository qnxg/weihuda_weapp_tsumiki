import type { ExamScheduleItem } from "@/apis/models/exam"
import type { Dayjs } from "@/utils/dayjs"
import { Picker, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { FONT_COLOR } from "@/config/color"
import NextIcon from "@/static/tools/exam/exam-arrange/next.svg"
import PrevIcon from "@/static/tools/exam/exam-arrange/prev.svg"
import { ExamCard } from "@/tools/pages/exam/exam/components/exam-card"
import { cn } from "@/utils/cn"
import dayjs from "@/utils/dayjs"

export function Calender({
  exams,
  onShowDetail,
}: Readonly<{
  exams: ExamScheduleItem[] | null
  onShowDetail: (exam: ExamScheduleItem) => void
}>) {
  // YYYY-MM-DD 格式的日期字符串
  const [date, setDate] = useState(() => dayjs().format("YYYY-MM-DD"))

  const days: Dayjs[] = useMemo(() => {
    const start = dayjs(date).startOf("month").day(0)
    const end = dayjs(date).endOf("month").day(6)

    const days: Dayjs[] = []
    for (let day = start; day.isBefore(end) || day.isSame(end); day = day.add(1, "day")) {
      days.push(day)
    }

    return days
  }, [date])

  const todayExams = useMemo(() => exams
    ? exams.filter(item => dayjs(item.date, "YYYY-MM-DD").isSame(dayjs(date), "day"))
    : [], [exams, date])

  return (
    <View className="flex flex-col gap p">
      <Card>
        <CardContent className="flex flex-col gap">
          <View className="flex items-center justify-between">
            <Icon
              style={{
                width: "48rpx",
                height: "48rpx",
              }}
              src={PrevIcon}
              onClick={() => setDate(prev => dayjs(prev).subtract(1, "month").format("YYYY-MM-DD"))}
            />

            <View className="flex-1">
              <Picker
                mode="date"
                fields="month"
                value={date}
                onChange={(e) => {
                  const newDate = dayjs(e.detail.value, "YYYY-MM")
                  setDate(newDate.format("YYYY-MM-DD"))
                }}
              >
                <View className="flex center text-xl text-bold">
                  {dayjs(date).format("YYYY-MM")}
                </View>
              </Picker>
            </View>

            <Icon
              style={{
                width: "48rpx",
                height: "48rpx",
              }}
              src={NextIcon}
              onClick={() => setDate(prev => dayjs(prev).add(1, "month").format("YYYY-MM-DD"))}
            />
          </View>

          <View
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {/* 日显示条 */}
            {(["日", "一", "二", "三", "四", "五", "六"] as const).map(item => (
              <View
                key={item}
                className="size-xs flex center text-toned"
              >
                {item}
              </View>
            ))}

            {days.map(day => (
              <View
                key={day.format("YYYY-MM-DD")}
                className={cn(
                  "relative size-xs flex center rounded-sm",
                  day.isSame(dayjs(date), "month") ? "text-hightlight" : "text-toned",
                  day.isSame(dayjs(date), "day") ? "bg-primary text-reverse" : "",
                )}
                onClick={() => setDate(day.format("YYYY-MM-DD"))}
              >
                {day.date()}

                {/* 当日有考试标记 */}
                {exams?.some(item => dayjs(item.date, "YYYY-MM-DD").isSame(day, "day")) && (
                  <View
                    className="absolute rounded-full"
                    style={{
                      width: "32rpx",
                      height: "4rpx",
                      bottom: "16rpx",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: FONT_COLOR[1],
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {todayExams.map((item, index) => (
        <ExamCard
          key={`${item.course_name}-${item.customize_id}-${index}`}
          exam={item}
          color={FONT_COLOR[index % FONT_COLOR.length]}
          onClick={() => onShowDetail(item)}
        />
      ))}
    </View>
  )
}
