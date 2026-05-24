import { navigateTo, switchTab } from "@tarojs/taro"

const TAB_LIST = [
  "/pages/index/index",
  "/pages/toolkit/index",
  "/pages/table/index",
  "/pages/profile/index",
]

/**
 * @description 通用导航函数, 自动区分普通页面和 tab 页面
 * @param {string} to - 目标页面路径
 */
export function navigate(to: string) {
  if (TAB_LIST.includes(to)) {
    void switchTab({ url: to })
  }
  else {
    void navigateTo({ url: to })
  }
}
