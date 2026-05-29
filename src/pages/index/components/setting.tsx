import { View } from "@tarojs/components"
import { MyButton } from "@/components/my-button"

export function Setting() {
  return (
    <View className="my bg p flex center rounded-sm">
      <MyButton
        className="text-primary"
        to="/setting/pages/index-card/index"
      >
        设置卡片
      </MyButton>
    </View>
  )
}
