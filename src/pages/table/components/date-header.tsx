import type { Dayjs } from "@/utils/dayjs"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import dayjs from "@/utils/dayjs"

const WEEK_DAYS = ["日", "一", "二", "三", "四", "五", "六"]

/**
 * @description 顶部日期表头
 *   - start: 学期开始日期, 格式为 "YYYY-MM-DD"
 *   - week: 当前周数, 从 1 开始
 */
export function DateHeader({
  start = "",
  week = 1,
}: Readonly<{
  start?: string
  week?: number
}>) {
  // 当 start 与 week 为默认值时, header 自动显示本周
  const now = dayjs()
  const semesterStart = start ? dayjs(start) : dayjs()
  const weekStart = semesterStart.add(week - 1, "week").startOf("week")

  const days: Dayjs[] = []

  for (let i = 0; i < 7; i++) {
    days.push(weekStart.add(i, "day"))
  }

  return (
    <View
      className="flex-1 py-xs flex items-center justify-evenly"
      style={{
        gap: "4rpx",
      }}
    >
      {days.map(day => (
        <View
          key={day.format("YYYY-MM-DD")}
          className={cn(
            "h-xs flex-1 flex flex-col items-center justify-center",
            day.isSame(now, "day") ? "text-primary" : "",
          )}
        >
          <View>{`周${WEEK_DAYS[day.day()]}`}</View>
          <View>{`${day.month() + 1}/${day.date()}`}</View>
        </View>
      ))}
    </View>
  )
}
