import type { Setting } from "@/hooks/setting"

/**
 * @description 默认设置, 用于用户未设置时的默认值
 */
export const SETTINGS: Setting = {
  indexCardSetting: {
    version: 1,
    setting: {
      cards: ["jifen", "courses", "tasks", "electricity", "campus", "count_down", "grade", "email"],
    },
  },
  tableSetting: {
    version: 1,
    setting: {
      displayNotCurrentWeekCourses: true,
    },
  },
}
