import { View } from "@tarojs/components"
import { Card, CardContent, CardHeader } from "@/components/card"

/**
 * @description 校园卡余额
 */
export function Campus() {
  return (
    <Card>
      <CardHeader
        title="校园卡余额"
        action="查看账单"
      />
      <CardContent className="h-lg p flex items-center justify-between text-xl">
        <View>卡号: 114514</View>
        <View>余额: 114.5</View>
      </CardContent>
    </Card>
  )
}
