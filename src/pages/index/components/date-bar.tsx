import type { Dayjs } from "@/utils/dayjs"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import dayjs from "@/utils/dayjs"

const WEEK_DAYS = ["日", "一", "二", "三", "四", "五", "六"]

export function DateBar() {
  const now = dayjs()
  const weekStart = now.startOf("week")

  const days: Dayjs[] = []

  for (let i = 0; i < 7; i++) {
    days.push(weekStart.add(i, "day"))
  }

  return (
    <View className="w-full py-xs flex items-center justify-around">
      {days.map(day => (
        <View
          key={day.format("YYYY-MM-DD")}
          className={cn(
            "size-xs flex flex-col items-center justify-center rounded-sm",
            day.isSame(now, "day") ? "bg-primary text-reverse" : "",
          )}
        >
          <View>{day.date() === 1 ? `${day.month()}月` : `${day.date()}日`}</View>
          <View>{`周${WEEK_DAYS[day.day()]}`}</View>
        </View>
      ))}
    </View>
  )
}
