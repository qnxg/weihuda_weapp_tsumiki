import { View } from "@tarojs/components"
import { SCHEDULES } from "@/config/schedule"
import { cn } from "@/utils/cn"
import { od } from "@/utils/ohday"

/**
 * @description 左侧时间表头
 */
export function TimeHeader() {
  const now = od()
  const current = SCHEDULES.find((schedule) => {
    const start = od(schedule.start)
    const end = od(schedule.end)
    return now.bt(start, end.add("ms", 1))
  })?.index

  return (
    <View
      className="w-xs flex flex-col"
      style={{
        gap: "4rpx",
      }}
    >
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
