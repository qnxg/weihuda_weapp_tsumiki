import type { AuthLoginRequest } from "@/apis/models/auth"
import { Input, View } from "@tarojs/components"
import Taro, { hideLoading, navigateBack, showLoading, showToast } from "@tarojs/taro"
import { encode } from "js-base64"
import { useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { useAuth } from "@/hooks/auth"
import { useMutation } from "@/hooks/request"
import { unlockAuthPrompts } from "@/libs/auth-bridge"
import { refreshTokenStorage } from "@/utils/auth"

/**
 * @description 账号密码登录
 */
export function Login() {
  const [stuId, setStuId] = useState("")
  const [password, setPassword] = useState("")

  const { updateUser } = useAuth()

  // 登录
  const { mutate } = useMutation(
    (data: AuthLoginRequest) => api.auth.login(data),
    {
      onMutate: () => {
        void showLoading({ title: "登录中..." })
      },
      onSuccess: async (res) => {
        // 保存 refresh_token, 供后续静默刷新 access_token 使用
        await refreshTokenStorage.set(res.refresh_token)

        hideLoading()

        // 鉴权成功: 解锁会话锁, 允许后续 401 再次弹窗
        unlockAuthPrompts()

        void showToast({
          title: "登录成功",
          icon: "success",
        })

        // 重新拉取用户信息; 首次请求会触发 refresh 流程自动换取 access_token
        await updateUser()

        void navigateBack()
      },
      onError: (err) => {
        hideLoading()
        switch (err.code) {
          case "PASSWORD_ERROR":
            void showToast({
              title: "密码错误",
              icon: "error",
            })
            break
          case "PASSWORD_SHOULD_CHANGE":
            void showToast({
              title: "密码需要修改",
              icon: "error",
            })
            break
          case "ACCOUNT_FROZEN":
            void showToast({
              title: "账号被冻结",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: err.message || "登录失败",
              icon: "error",
            })
        }
      },
    },
  )

  const handleSubmit = async () => {
    if (!stuId || !password) {
      void showToast({
        title: "请填写学号和密码",
        icon: "error",
      })
      return
    }

    // 获取微信登录凭证
    const loginRes = await Taro.login()
    if (!loginRes.code) {
      void showToast({
        title: "获取微信登录凭证失败",
        icon: "error",
      })
      return
    }

    // base64 编码密码
    const encodedPassword = encode(password)

    mutate({
      code: loginRes.code,
      stu_id: stuId,
      password: encodedPassword,
    })
  }

  return (
    <View className="flex flex-col gap p">
      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="flex items-center">
            <View className="w-l-sm">学号*</View>
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
            <View className="w-l-sm">密码*</View>
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
