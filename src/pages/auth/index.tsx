import { useRouter } from "@tarojs/taro"
import { useState } from "react"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { Login } from "@/pages/auth/components/login"
import { TFA } from "@/pages/auth/components/tfa"

/**
 * @description 鉴权页 Tab 值
 * - login: 账号密码登录
 * - tfa: 双因子认证验证码
 */
export type TabValue = "login" | "tfa"

export default function Auth() {
  const router = useRouter()

  // 初始 Tab 由跳转来源的路由参数决定, 缺省为登录
  const initialTab: TabValue = router.params.tab === "tfa" ? "tfa" : "login"

  // Tab 受控且禁止用户手动切换, 仅由代码根据入口来源设置
  const [tab] = useState<TabValue>(initialTab)

  return (
    <Page>
      <Tabs value={tab}>
        <TabList>
          <TabTrigger value="login">登录</TabTrigger>
          <TabTrigger value="tfa">验证码</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent fixed className="h-full">
        {tab === "login" ? <Login /> : <TFA />}
      </PageContent>
    </Page>
  )
}
