/**
 * @description 积分记录项
 * @property {number} id - 记录 ID
 * @property {number} jifen - 积分变动数量
 * @property {string} description - 记录描述
 * @property {string} created_at - 记录创建时间
 */
export interface JifenRecordItem {
  id: number
  jifen: number
  description: string
  created_at: string
}

/**
 * @description 积分奖品项
 * @property {number} id - 奖品 ID
 * @property {string} name - 奖品名称
 * @property {string} cover - 奖品图片 URL
 * @property {number} count - 奖品数量
 * @property {number} price - 奖品价格(积分)
 * @property {string | null} description - 奖品描述
 */
export interface JifenGoodsItem {
  id: number
  name: string
  cover: string
  count: number
  price: number
  description: string | null
}

/**
 * @description 获取积分总数响应
 * @property {number} jifen - 当前积分总数
 * @property {number} combo - 当前连续签到天数
 * @property {boolean} is_checked - 今日是否已签到
 * @see https://app.apifox.com/link/project/8311217/apis/api-470226524
 */
export interface JifenGetResponse {
  jifen: number
  combo: number
  is_checked: boolean
}

/**
 * @description 获取积分记录请求
 * @property {number} [page] - 页码
 * @property {number} [size] - 每页记录数
 * @see https://app.apifox.com/link/project/8311217/apis/api-470236473
 */
export interface JifenGetRecordRequest {
  page?: number
  size?: number
}

/**
 * @description 获取积分记录响应
 * @property {number} total - 记录总数
 * @property {JifenRecordItem[]} records - 记录列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-470236473
 */
export interface JifenGetRecordResponse {
  total: number
  records: JifenRecordItem[]
}

/**
 * @description 获取积分奖品列表响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-470321823
 */
export type JifenGetGoodsResponse = JifenGoodsItem[]

/**
 * @description 获取积分说明响应
 * @property {string} description - 积分说明
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582591
 */
export interface JifenGetDescResponse {
  description: string
}

/**
 * @description 签到响应
 * @property {number} delta - 增加积分
 * @see https://app.apifox.com/link/project/8311217/apis/api-470228898
 */
export interface JifenPostResponse {
  delta: number
}
