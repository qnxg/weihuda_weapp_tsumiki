import { View } from "@tarojs/components"
import { Card, CardContent, CardHeader } from "@/components/card"

/**
 * @description 电量
 */
export function Electricity() {
  return (
    <Card>
      <CardHeader
        title="宿舍电量"
        action="查看电量"
      />
      <CardContent className="h-lg p flex items-center justify-between text-xl">
        <View>宿舍号: 123</View>
        <View>剩余电量: 1145.14度</View>
      </CardContent>
    </Card>
  )
}
