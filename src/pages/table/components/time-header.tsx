import { View } from "@tarojs/components"
import { SCHEDULES } from "@/config/schedule"
import { cn } from "@/utils/cn"
import dayjs from "@/utils/dayjs"

/**
 * @description 左侧时间表头
 */
export function TimeHeader() {
  const now = dayjs()
  const current = SCHEDULES.find((schedule) => {
    const start = dayjs(schedule.start, "HH:mm")
    const end = dayjs(schedule.end, "HH:mm")
    return now.isBetween(start, end, null, "[]")
  })?.index

  return (
    <View className="w-xs flex flex-col gap-2xs">
      {SCHEDULES.map(schedule => (
        <View
          key={schedule.index}
          className={cn(
            "w-xs h flex flex-col items-center justify-center",
            current === schedule.index ? "text-primary" : "",
          )}
        >
          <View>{schedule.index}</View>
          <View className="text-sm">{schedule.start}</View>
          <View className="text-sm">{schedule.end}</View>
        </View>
      ))}
    </View>
  )
}
