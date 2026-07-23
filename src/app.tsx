import type { PropsWithChildren } from "react"
import Taro, { setTabBarItem, useLaunch } from "@tarojs/taro"

import { AuthProvider } from "@/contexts/auth"
import { SemesterProvider } from "@/contexts/semester"
import { SettingProvider } from "@/contexts/setting"
import theme from "./theme.json"
import "./app.scss"

interface ThemeData { light: Record<string, string>, dark: Record<string, string> }
const themeData = theme as ThemeData

// vite-runner 构建时会尝试将 tabBar.iconPath 作为文件路径直接读取，
// 但不支持 `@变量名` 语法(webpack-runner 支持), 导致构建失败。
// 因此 app.config.ts 中 tabBar 使用字面路径，这里通过 setTabBarItem 运行时动态设置图标。
function updateTabBarIcons(theme: "light" | "dark") {
  const data = themeData[theme]
  const iconMap = [
    { icon: data.indexIconDefault, selected: data.indexIconSelected },
    { icon: data.toolkitIconDefault, selected: data.toolkitIconSelected },
    { icon: data.tableIconDefault, selected: data.tableIconSelected },
    { icon: data.profileIconDefault, selected: data.profileIconSelected },
  ]
  iconMap.forEach((item, index) => {
    const iconFile = item.icon.split("/").pop()
    const selectedFile = item.selected.split("/").pop()
    void setTabBarItem({
      index,
      iconPath: `static/tab/${iconFile}`,
      selectedIconPath: `static/tab/${selectedFile}`,
    })
  })
}

export default function App({
  children,
}: PropsWithChildren<any>) {
  useLaunch(() => {
    const theme = Taro.getAppBaseInfo().theme || "light"
    updateTabBarIcons(theme as "light" | "dark")
    Taro.onThemeChange(({ theme }) => {
      updateTabBarIcons(theme as "light" | "dark")
    })
  })

  return (
    <AuthProvider>
      <SettingProvider>
        <SemesterProvider>
          {children}
        </SemesterProvider>
      </SettingProvider>
    </AuthProvider>
  )
}
