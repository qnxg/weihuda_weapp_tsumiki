/**
 * @description 用户信息响应
 * @property {string} class - 班级
 * @property {string} name - 姓名
 * @property {string} major - 专业
 * @property {number} enter - 入学年份
 * @property {string} sex - 性别
 * @property {number | null} xz - 血制
 * @property {string} stu_id - 学号
 * @see https://app.apifox.com/link/project/8311217/apis/api-461766515
 */
export interface MeResponse {
  class: string
  name: string
  major: string
  enter: number
  sex: string
  xz: number | null
  stu_id: string
}

/**
 * @description 首页卡片设置请求数据
 * @property {number} version - 版本号
 * @property {object} setting - 设置内容
 * @property {string[]} setting.cards - 卡片 key 列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-465881355
 */
export interface IndexCardSettingRequestData {
  version: number
  setting: {
    cards: string[]
  }
}

/**
 * @description 课表设置请求数据
 * @property {number} version - 版本号
 * @property {object} setting - 设置内容
 * @property {boolean} setting.display_not_current_week_courses - 是否显示非本周课程
 * @see https://app.apifox.com/link/project/8311217/apis/api-465881355
 */
export interface TableSettingRequestData {
  version: number
  setting: {
    display_not_current_week_courses: boolean
  }
}

/**
 * @description 获取全部设置的响应
 * @property {IndexCardSettingRequestData} index_card_setting - 首页卡片设置
 * @property {TableSettingRequestData} table_setting - 课表设置
 * @see https://app.apifox.com/link/project/8311217/apis/api-465876637
 */
export interface MeSettingResponse {
  index_card_setting: IndexCardSettingRequestData
  table_setting: TableSettingRequestData
}
