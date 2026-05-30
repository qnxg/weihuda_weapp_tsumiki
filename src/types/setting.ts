/**
 * @description 首页卡片设置项
 * @property {string[]} cards - 展示的首页卡片, 存储 key
 */
export interface IndexCardSettingContent {
  cards: string[]
}

/**
 * @description 课表设置项
 * @property {boolean} displayNotCurrentWeekCourses - 是否显示非本周课程
 */
export interface TableSettingContent {
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

/**
 * @description 全部设置数据类型
 * @property {IndexCardSetting | null} indexCardSetting - 首页卡片设置
 * @property {TableSetting | null} tableSetting - 课表设置
 */
export interface Setting {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
}
