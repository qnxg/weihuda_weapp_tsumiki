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
 * @description 主题 Hook
 */
// eslint-disable-next-line react/no-unnecessary-use-prefix
export function useTheme(): ThemeHookResult {
  const theme = Taro.getAppBaseInfo().theme ?? "light"
  const isDark = theme === "dark"

  return {
    theme,
    isDark,
  }
}
