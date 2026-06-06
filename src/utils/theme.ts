import Taro from "@tarojs/taro"

/**
 * @property theme 当前主题, 值为 "light" 或 "dark"
 * @property isDark 当前主题是否为暗色模式
 */
interface ThemeHookResult {
  theme: string
  isDark: boolean
}

/**
 * @description 获取主题
 */
export function getTheme(): ThemeHookResult {
  const theme = Taro.getAppBaseInfo().theme ?? "light"

  const isDark = theme === "dark"

  return {
    theme,
    isDark,
  }
}
