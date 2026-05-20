import { navigateTo, switchTab } from "@tarojs/taro"

const TAB_LIST = [
  "/pages/index/index",
  "/pages/toolkit/index",
  "/pages/table/index",
  "/pages/profile/index",
]

export function navigate(to: string) {
  if (TAB_LIST.includes(to)) {
    void switchTab({ url: to })
  }
  else {
    void navigateTo({ url: to })
  }
}
