import type { ComponentProps } from "react"
import { View } from "@tarojs/components"
import Taro, { useRouter } from "@tarojs/taro"
import { useEffect, useState } from "react"

import { Icon } from "@/components/icon"
import indexDarkSelected from "@/static/tab/index-dark-selected.png"
import indexDefault from "@/static/tab/index-default.png"
import indexSelected from "@/static/tab/index-selected.png"
import profileDarkSelected from "@/static/tab/profile-dark-selected.png"
import profileDefault from "@/static/tab/profile-default.png"
import profileSelected from "@/static/tab/profile-selected.png"
import tableDarkSelected from "@/static/tab/table-dark-selected.png"
import tableDefault from "@/static/tab/table-default.png"
import tableSelected from "@/static/tab/table-selected.png"
import toolkitDarkSelected from "@/static/tab/toolkit-dark-selected.png"
import toolkitDefault from "@/static/tab/toolkit-default.png"
import toolkitSelected from "@/static/tab/toolkit-selected.png"
import { cn } from "@/utils/cn"
import "./index.scss"

type NavTheme = "light" | "dark"

interface NavIconMap {
  default: string
  light: string
  dark: string
}

/** 取当前系统主题, 无 theme 字段时按浅色处理 */
function getNavTheme(): NavTheme {
  return Taro.getAppBaseInfo().theme === "dark" ? "dark" : "light"
}

/**
 * @description 自定义悬浮药丸导航栏 (替代原生 tabBar)
 *  固定于底部中央, 半透明表面 + 细边框 + 受控阴影.
 *  仅用于四个 tab 页: 首页 / 工具箱 / 课表 / 我的
 *  图标复用 `src/static/tab/` 的原生 tabBar 图标, 激活态按主题切换 selected / dark-selected.
 * @example
 * ```tsx
 * <Page>
 *   ... 页面内容 ...
 *   <NavBar />
 * </Page>
 * ```
 */
function NavBar({ className }: Readonly<{ className?: string } & Pick<ComponentProps<typeof View>, "style">>) {
  const router = useRouter()
  const [active, setActive] = useState("index")
  const [theme, setTheme] = useState<NavTheme>(getNavTheme)

  useEffect(() => {
    const handleThemeChange = ({ theme }: { theme: NavTheme }) => {
      setTheme(theme)
    }
    Taro.onThemeChange(handleThemeChange)
    return () => Taro.offThemeChange(handleThemeChange)
  }, [])

  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const current = pages.at(-1)
    const route = typeof current === "object" && current !== null
      ? (current.route ?? router.path ?? "")
      : (router.path ?? "")
    if (route.includes("toolkit"))
      setActive("toolkit")
    else if (route.includes("table"))
      setActive("table")
    else if (route.includes("profile"))
      setActive("profile")
    else
      setActive("index")
  }, [router.path])

  const items: { key: string, label: string, icons: NavIconMap, to: string }[] = [
    {
      key: "index",
      label: "首页",
      icons: { default: indexDefault, light: indexSelected, dark: indexDarkSelected },
      to: "/pages/index/index",
    },
    {
      key: "toolkit",
      label: "工具箱",
      icons: { default: toolkitDefault, light: toolkitSelected, dark: toolkitDarkSelected },
      to: "/pages/toolkit/index",
    },
    {
      key: "table",
      label: "课表",
      icons: { default: tableDefault, light: tableSelected, dark: tableDarkSelected },
      to: "/pages/table/index",
    },
    {
      key: "profile",
      label: "我的",
      icons: { default: profileDefault, light: profileSelected, dark: profileDarkSelected },
      to: "/pages/profile/index",
    },
  ]

  return (
    <View className={cn("nav-float", className)}>
      {items.map((item) => {
        const isActive = active === item.key
        const iconSrc = isActive
          ? (theme === "dark" ? item.icons.dark : item.icons.light)
          : item.icons.default
        return (
          <View
            key={item.key}
            className={cn("nav-item", isActive && "nav-item-active")}
            hoverClass="nav-item-pressed"
            hoverStartTime={0}
            hoverStayTime={80}
            onClick={() => Taro.switchTab({ url: item.to })}
          >
            <Icon
              src={iconSrc}
              theme="light"
              className={cn("nav-icon size-s-xl", isActive && "nav-icon-active")}
            />
            <View className={cn("nav-label", isActive && "nav-label-active")}>
              {item.label}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export { NavBar }
