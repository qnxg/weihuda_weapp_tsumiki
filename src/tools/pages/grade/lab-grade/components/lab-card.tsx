import type { LabGradeItem } from "@/apis/models/lab"
import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Options } from "@/components/options"

export default function LabCard({
  item,
  index,
}: Readonly<{
  item: LabGradeItem
  index: number
}>) {
  return (
    <Card>
      <CardContent className="flex flex-col">
        <View className="bg flex items-start justify-between gap">
          <View className="flex flex-col gap-xs">
            <View className="text-sm text-primary">
              {`实验 ${String(index + 1).padStart(2, "0")}`}
            </View>
            <View className="text-xl text-bold">{item.lab_name}</View>
            <View className="flex items-center gap-xs text-sm">
              <View className="text-muted">出勤</View>
              <View className="text-toned">{item.attendance ?? "--"}</View>
            </View>
          </View>
          <View
            className="flex flex-col items-end gap-xs"
            style={{ flexShrink: 0, maxWidth: "35%" }}
          >
            <View className="text-sm text-muted">实验成绩</View>
            <View className="text-2xl text-bold text-primary">
              {item.score || "--"}
            </View>
          </View>
        </View>

        <View className="py">
          <View
            className="bg-subtle rounded-full"
            style={{
              height: "4rpx",
            }}
          />
        </View>

        <View className="bg flex flex-col gap-sm">
          <View className="text-sm text-toned">成绩组成</View>
          {item.details.length === 0
            ? (
                <View className="text-sm text-muted py-sm">暂无成绩组成</View>
              )
            : (
                <Options>
                  {item.details.map((detail, detailIndex) => (
                    <View
                      key={`${detail.name}-${detailIndex}`}
                      className="flex items-center justify-between bg px-md py-sm gap"
                    >
                      <View
                        className="text-toned"
                        style={{ minWidth: 0 }}
                      >
                        {detail.name}
                      </View>
                      <View
                        className="text-lg text-bold"
                        style={{ flexShrink: 0 }}
                      >
                        {detail.score ?? "暂无"}
                      </View>
                    </View>
                  ))}
                </Options>
              )}
        </View>
      </CardContent>
    </Card>
  )
}
