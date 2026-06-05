import type { Cell } from "@/pages/table"
import { View } from "@tarojs/components"
import { useState } from "react"

export function TableContent({
  week,
  cells,
  onShowDetail,
  onChangePrevWeek,
  onChangeNextWeek,
}: Readonly<{
  week: number
  cells: Cell[][]
  onShowDetail: (cell: Cell) => void
  onChangePrevWeek: () => void
  onChangeNextWeek: () => void
}>) {
  const [touchStartPosX, setTouchStartPosX] = useState(0)

  // 此处类型不规范为 Taro 的问题
  const handleTouchStart = (e: any) => {
    if (e.touches.length === 1) {
      setTouchStartPosX(e.changedTouches[0].pageX)
    }
  }

  const handleTouchEnd = (e: any) => {
    if (e.changedTouches.length === 1) {
      const end = e.changedTouches[0].pageX
      const offset = end - touchStartPosX
      if (Math.abs(offset) <= 80)
        return
      offset > 0 ? onChangePrevWeek() : onChangeNextWeek()
    }
  }

  return (
    <View
      className="flex-1 h-full"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        // 同 h
        gridTemplateRows: "repeat(12, 120rpx)",
        gap: "4rpx",
      }}
      onTouchStart={e => handleTouchStart(e)}
      onTouchEnd={e => handleTouchEnd(e)}
    >
      {cells.map(dayCells => dayCells.map((cell) => {
        const current = cell.items.find(i => i.weeks.includes(week))
        const display = current ?? cell.items[0]

        if (!display)
          return null

        return (
          <View
            key={`${cell.day}-${cell.start}`}
            className="relative rounded-sm"
            style={{
              padding: "6rpx",
              gridColumn: cell.day + 1,
              gridRow: `${cell.start} / span ${cell.span}`,
              backgroundColor: current ? current.bgColor : "#efefef",
              color: current ? current.color : "#aeaeae",
            }}
            onClick={() => onShowDetail(cell)}
          >
            <View
              className="text-md overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "3",
              }}
            >
              {display.course_name}
            </View>
            {display.place && (
              <View className="text-sm">
                @
                {display.place}
              </View>
            )}

            {/* 多课程合并标记 */}
            {cell.items.length > 1 && (
              <View
                className="absolute"
                style={{
                  display: "block",
                  right: "3rpx",
                  bottom: "3rpx",
                  width: "0",
                  height: "0",
                  border: "12rpx solid", // 同 rounded-sm
                  borderRadius: "10rpx 0 10rpx 0",
                  borderColor: "#d8d8d8 #eeeeee #eeeeee #d8d8d8",
                }}
              />
            )}
          </View>
        )
      }))}
    </View>
  )
}
