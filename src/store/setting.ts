import { create } from "zustand"

/**
 * @description 首页卡片设置项
 * @property {string} cards - 展示的首页卡片, 存储 key
 */
interface IndexCardSettingContent {
  cards: string[]
}

/**
 * @description 课表设置项
 * @property {boolean} displayNotCurrentWeekCourses - 是否显示非本周课程
 */
interface TableSettingContent {
  displayNotCurrentWeekCourses: boolean
}

/**
 * @description 通用设置
 * @template T - 设置内容的类型
 * @property {number} version - 设置版本, 用于更新设置时的版本控制
 * @property {T} setting - 设置内容
 */
export interface CommonSetting<T> {
  version: number
  setting: T
}

/**
 * @description 首页卡片设置
 */
export type IndexCardSetting = CommonSetting<IndexCardSettingContent>

/**
 * @description 课表设置
 */
export type TableSetting = CommonSetting<TableSettingContent>

interface SettingStoreValue {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
  isLoading: boolean
  isUpdating: boolean
  setIndexCardSetting: (setting: IndexCardSetting) => void
  setTableSetting: (setting: TableSetting) => void
  setIsLoading: (isLoading: boolean) => void
  setIsUpdating: (isUpdating: boolean) => void
}

export const useSettingStore = create<SettingStoreValue>(set => ({
  indexCardSetting: null,
  tableSetting: null,
  isLoading: true,
  isUpdating: false,
  setIndexCardSetting: setting => set({ indexCardSetting: setting }),
  setTableSetting: setting => set({ tableSetting: setting }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsUpdating: isUpdating => set({ isUpdating }),
}))
