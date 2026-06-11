/**
 * @description 用户信息响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-461766515
 */
export interface MeResponse {
  class: string
  name: string
  major: string
  enter: number
  college: string
  sex: string
  xz: number | null
  stu_id: string
}

/**
 * @description 首页卡片设置请求数据
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
 * @see https://app.apifox.com/link/project/8311217/apis/api-465876637
 */
export interface MeSettingResponse {
  index_card_setting: IndexCardSettingRequestData
  table_setting: TableSettingRequestData
}

/**
 * @description 获取当前用户信息请求
 */
export type MeGetRequest = undefined

/**
 * @description 获取当前用户信息响应
 */
export type MeGetResponse = MeResponse

/**
 * @description 获取设置请求
 */
export type MeSettingGetRequest = undefined

/**
 * @description 获取设置响应
 */
export type MeSettingGetResponse = MeSettingResponse

/**
 * @description 获取首页卡片设置请求
 */
export type MeSettingGetIndexCardRequest = undefined

/**
 * @description 获取首页卡片设置响应
 */
export type MeSettingGetIndexCardResponse = IndexCardSettingRequestData

/**
 * @description 获取课表设置请求
 */
export type MeSettingGetTableRequest = undefined

/**
 * @description 获取课表设置响应
 */
export type MeSettingGetTableResponse = TableSettingRequestData

/**
 * @description 修改首页卡片设置请求
 */
export type MeSettingPutIndexCardRequest = IndexCardSettingRequestData

/**
 * @description 修改首页卡片设置响应
 */
export type MeSettingPutIndexCardResponse = IndexCardSettingRequestData

/**
 * @description 修改课表设置请求
 */
export type MeSettingPutTableRequest = TableSettingRequestData

/**
 * @description 修改课表设置响应
 */
export type MeSettingPutTableResponse = TableSettingRequestData
