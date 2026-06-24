import { Picker, View } from "@tarojs/components"
import { useState } from "react"
import { useUser } from "@/hooks/user"
import dayjs from "@/utils/dayjs"

interface MonthPickerProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

export function MonthPicker({ year, month, onChange }: MonthPickerProps) {
  const { user } = useUser()

  const years = user?.enter
    ? Array.from({ length: dayjs().year() - user.enter + 1 }).map((_, i) => dayjs().year() - i)
    : [dayjs().year()]
  const months = Array.from({ length: 12 }).map((_, i) => i + 1)

  const yearIndex = years.indexOf(year)
  const monthIndex = month - 1

  const [pickerValue, setPickerValue] = useState<[number, number]>([
    yearIndex >= 0 ? yearIndex : 0,
    monthIndex >= 0 ? monthIndex : 0,
  ])

  return (
    <Picker
      mode="multiSelector"
      range={[years, months]}
      value={pickerValue}
      onColumnChange={(e) => {
        const newValue = [...pickerValue] as [number, number]
        newValue[e.detail.column] = e.detail.value
        setPickerValue(newValue)
      }}
      onChange={() => {
        onChange(years[pickerValue[0]], months[pickerValue[1]])
      }}
    >
      <View className="flex items-center justify-end text-primary">
        {year}
        {" 年 "}
        {month}
        {" 月 "}
      </View>
    </Picker>
  )
}
