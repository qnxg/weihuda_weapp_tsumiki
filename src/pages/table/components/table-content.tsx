import type { Cell } from "@/pages/table"
import { View } from "@tarojs/components"

export function TableContent({
  week,
  cells,
}: Readonly<{
  week: number
  cells: Cell[][]
}>) {
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
    >
      {cells.map(dayCells => dayCells.map((cell) => {
        const current = cell.items.find(i => i.weeks.includes(week))
        const display = current ?? cell.items[0]

        if (!display)
          return null

        return (
          <View
            key={`${cell.day}-${cell.start}`}
            className="relative"
            style={{
              gridColumn: cell.day + 1,
              gridRow: `${cell.start} / span ${cell.span}`,
              backgroundColor: current ? current.bgColor : "#efefef",
              color: current ? current.color : "#aeaeae",
            }}
          >
            {cell.items.map(i => i.course_name).join(",")}

            {/* 多课程合并标记 */}
            {cell.items.length >= 0 && (
              <View
                className="absolute"
                style={{
                  display: "block",
                  right: "3rpx",
                  bottom: "3rpx",
                  width: "0",
                  height: "0",
                  border: "12rpx solid",
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
