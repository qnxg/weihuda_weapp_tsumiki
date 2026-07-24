import { Input, View } from "@tarojs/components"
import { hideLoading, navigateBack, showLoading, showToast } from "@tarojs/taro"
import { useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { unlockAuthPrompts } from "@/libs/auth-bridge"

/**
 * @description 获取验证码冷却秒数
 */
const RESEND_SECONDS = 60

/**
 * @description 双因子认证验证码
 * @param {string} phone - 401 TFA 下发的手机号, 只读展示
 */
export function TFA({
  phone,
}: Readonly<{
  phone: string
}>) {
  const [code, setCode] = useState("")

  // 获取验证码冷却倒计时, 0 表示可点击
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const handleSendCode = () => {
    if (countdown > 0) {
      return
    }

    void showLoading({ title: "发送中..." })
    api.auth.tfa.get()
      .then(() => {
        hideLoading()
        void showToast({
          title: "验证码已发送",
          icon: "success",
        })

        setCountdown(RESEND_SECONDS)
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      })
      .catch(() => {
        hideLoading()
        void showToast({
          title: "验证码发送失败",
          icon: "error",
        })
      })
  }

  const handleSubmit = () => {
    if (!code) {
      void showToast({
        title: "请填写验证码",
        icon: "error",
      })
      return
    }

    void showLoading({ title: "验证中..." })
    api.auth.tfa.post({ code })
      .then(() => {
        hideLoading()

        // 鉴权成功: 解锁会话锁, 允许后续 401 再次弹窗
        unlockAuthPrompts()

        void showToast({
          title: "验证成功",
          icon: "success",
        })

        void navigateBack()
      })
      .catch(() => {
        hideLoading()
        void showToast({
          title: "验证失败",
          icon: "error",
        })
      })
  }

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <View className="h-full bg-page flex flex-col gap p">
      <Card>
        <CardContent className="p flex flex-col gap">
          <View className="text-toned">
            该操作需要进行双因子认证, 请输入验证码
          </View>

          <View className="flex items-center">
            <View className="w">手机号</View>
            <View className="flex-1">{phone}</View>
          </View>

          <View className="flex items-center gap">
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
            <MyButton
              active={countdown === 0}
              className="px py-sm flex center rounded-sm"
              onClick={() => handleSendCode()}
            >
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </MyButton>
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
