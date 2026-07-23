import { Input, View } from "@tarojs/components"
import { showToast } from "@tarojs/taro"
import { useState } from "react"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"

/**
 * @description 账号密码登录
 */
export function Login() {
  const [stuId, setStuId] = useState("")
  const [password, setPassword] = useState("")

  // TODO: PoW 计算 + 密码 RSA 加密 + api.auth.login, 待接口细节补充
  const submit = async () => {}

  const handleSubmit = () => {
    if (!stuId || !password) {
      void showToast({
        title: "请填写学号和密码",
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
          <View className="flex items-center">
            <View className="w">学号*</View>
            <Input
              placeholder="请输入学号(必填)"
              className="flex-1"
              value={stuId}
              onInput={(e) => {
                setStuId(e.detail.value)
              }}
            />
          </View>

          <View className="flex items-center">
            <View className="w">密码*</View>
            <Input
              password
              placeholder="请输入密码(必填)"
              className="flex-1"
              value={password}
              onInput={(e) => {
                setPassword(e.detail.value)
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
        登录
      </MyButton>
    </View>
  )
}
