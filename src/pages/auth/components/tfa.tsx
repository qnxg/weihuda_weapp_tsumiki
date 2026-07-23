import { Input, View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useState } from "react"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"

/**
 * @description 双因子认证验证码
 */
export function TFA() {
  const [code, setCode] = useState("")

  // TODO: api.auth.tfa.post, 待接口细节补充
  const submit = async () => {}

  const handleSubmit = () => {
    if (!code) {
      void showToast({
        title: "请填写验证码",
        icon: "error",
      })
      return
    }

    void submit()
  }

  return (
    <View className="h-full bg-page flex flex-col gap p">
      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="text-toned">
            该操作需要进行双因子认证, 请输入验证码
          </View>

          <View className="flex items-center">
            <View className="w">验证码*</View>
            <Input
              type="number"
              placeholder="请输入验证码(必填)"
              className="flex-1"
              value={code}
              onInput={(e) => {
                setCode(e.detail.value)
              }}
            />
          </View>
        </CardContent>
      </Card>

      <MyButton
        active={true}
        className="p flex center text-xl rounded-sm"
        onClick={() => handleSubmit()}
      >
        提交
      </MyButton>
    </View>
  )
}
