import type { OhDay } from "@twisuki/ohday"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"

const WEEK_DAYS = ["日", "一", "二", "三", "四", "五", "六"]

export function DateBar() {
  const now = od()
  const weekStart = now.sub("d", now.day).cs("d")

  const days: OhDay[] = []

  for (let i = 0; i < 7; i++) {
    days.push(weekStart.add("d", i))
  }

  return (
    <View className="w-full py-xs flex items-center justify-evenly">
      {days.map(day => (
        <View
          key={day.p("YYYY-MM-DD")}
          className={cn(
            "size-xs flex flex-col items-center justify-center rounded-sm",
            day.eq(now, "d") ? "bg-primary text-reverse" : "",
          )}
        >
          <View>{day.date === 1 ? `${day.month}月` : `${day.date}日`}</View>
          <View>{`周${WEEK_DAYS[day.day]}`}</View>
        </View>
      ))}
    </View>
  )
}
