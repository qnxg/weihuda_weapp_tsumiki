import { View } from "@tarojs/components"

export function TableContent() {
  return (
    <View
      className="flex-1 h-full gap-2xs"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(12, 1fr)",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        Array.from({ length: 7 }).map((_, j) => (
          <View key={`${i}${j}`} className="h bg-page">
            {`${i + 1}-${j + 1}`}
          </View>
        ))
      ))}
    </View>
  )
}
