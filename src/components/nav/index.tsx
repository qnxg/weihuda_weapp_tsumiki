import type { ComponentProps } from "react"
import { View } from "@tarojs/components"
import Taro, { useRouter } from "@tarojs/taro"
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
import { getTheme } from "@/utils/theme"
import "./index.scss"

interface NavIconMap {
  default: string
  light: string
  dark: string
}

/** 四个 tab 页路由表, key 为页面路径, 值为导航栏 key */
const TAB_ROUTES: Readonly<Record<string, string>> = {
  "pages/index/index": "index",
  "pages/toolkit/index": "toolkit",
  "pages/table/index": "table",
  "pages/profile/index": "profile",
}

/** 取当前页面路径, 优先 getCurrentPages 的 route, 缺失时兜底传入的 path */
function getRoutePath(fallback?: string): string {
  const pages = Taro.getCurrentPages()
  const current = pages.at(-1)
  return typeof current === "object" && current !== null
    ? (current.route ?? fallback ?? "")
    : (fallback ?? "")
}

/** 是否为四个 tab 页之一 */
function isTabRoute(route: string): boolean {
  return route in TAB_ROUTES
}

/**
 * @description 自定义悬浮药丸导航栏 (替代原生 tabBar)
 *  固定于底部中央, 半透明表面 + 细边框 + 受控阴影.
 *  仅用于四个 tab 页: 首页 / 工具箱 / 课表 / 我的, 由 Page 统一挂载,
 *  非 tab 页面不渲染.
 *  图标复用 `src/static/tab/` 的原生 tabBar 图标, 激活态按主题切换 selected / dark-selected.
 * @example
 * ```tsx
 * <Page>
 *   ... 页面内容 ...
 * </Page>
 * ```
 */
function NavBar({ className }: Readonly<{ className?: string } & Pick<ComponentProps<typeof View>, "style">>) {
  const router = useRouter()
  const active = TAB_ROUTES[getRoutePath(router.path)]
  // 微信小程序主题在启动时固定, 无需监听运行时切换
  const { isDark } = getTheme()

  // 非 tab 页不渲染
  if (!active)
    return null

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
          ? (isDark ? item.icons.dark : item.icons.light)
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

export { getRoutePath, isTabRoute, NavBar, TAB_ROUTES }
