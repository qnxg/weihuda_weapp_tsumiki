import { View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"

/**
 * @description 积分
 */
export function Jifen() {
  return (
    <Card>
      <CardContent className="p flex items-center justify-between">
        <View className="text-xl">
          当前积分: 114514
        </View>
        <MyButton
          active={true}
          className="w-lg py-xs flex center rounded-sm"
        >
          签到
        </MyButton>
      </CardContent>
    </Card>
  )
}
