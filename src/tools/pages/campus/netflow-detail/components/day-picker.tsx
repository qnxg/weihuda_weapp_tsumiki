import { Picker, View } from "@tarojs/components"
import { useState } from "react"
import { useUser } from "@/hooks/user"
import dayjs from "@/utils/dayjs"

interface DayPickerProps {
  year: number
  month: number
  day: number
  onChange: (year: number, month: number, day: number) => void
}

export function DayPicker({ year, month, day, onChange }: DayPickerProps) {
  const { user } = useUser()

  const years = user?.enter
    ? Array.from({ length: dayjs().year() - user.enter + 1 }).map((_, i) => dayjs().year() - i)
    : [dayjs().year()]
  const months = Array.from({ length: 12 }).map((_, i) => i + 1)

  const getDays = (y: number, m: number) => {
    return Array.from({ length: dayjs().set("year", y).set("month", m - 1).daysInMonth() }).map((_, i) => i + 1)
  }

  const yearIndex = years.indexOf(year)
  const monthIndex = month - 1
  const dayIndex = day - 1

  const [days, setDays] = useState(() => getDays(year, month))
  const [pickerValue, setPickerValue] = useState<[number, number, number]>([
    yearIndex >= 0 ? yearIndex : 0,
    monthIndex >= 0 ? monthIndex : 0,
    dayIndex >= 0 ? dayIndex : 0,
  ])

  return (
    <Picker
      mode="multiSelector"
      range={[years, months, days]}
      value={pickerValue}
      onColumnChange={(e) => {
        const newValue = [...pickerValue] as [number, number, number]
        newValue[e.detail.column] = e.detail.value

        // 如果月 column 变化, 更新 days 并检查 day 是否越界
        if (e.detail.column === 1) {
          const newMonth = months[e.detail.value]
          const newDays = getDays(year, newMonth)
          setDays(newDays)
          if (newValue[2] >= newDays.length) {
            newValue[2] = newDays.length - 1
          }
        }

        setPickerValue(newValue)
      }}
      onChange={() => {
        onChange(years[pickerValue[0]], months[pickerValue[1]], days[pickerValue[2]])
      }}
    >
      <View className="flex items-center justify-end text-primary">
        {year}
        {" 年 "}
        {month}
        {" 月 "}
        {day}
        {" 日 "}
      </View>
    </Picker>
  )
}
