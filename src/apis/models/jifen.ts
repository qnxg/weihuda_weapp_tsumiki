/**
 * @description 积分记录项
 * @property {number} id - 记录 ID
 * @property {number} jifen - 积分变动数量
 * @property {string} desc - 记录描述
 * @property {string} create_at - 记录创建时间
 */
interface JifenRecordItem {
  id: number
  jifen: number
  desc: string
  create_at: string
}

/**
 * @description 积分奖品项
 * @property {number} id - 奖品 ID
 * @property {string} name - 奖品名称
 * @property {string} cover - 奖品图片 URL
 * @property {number} count - 奖品数量
 * @property {number} price - 奖品价格(积分)
 * @property {string} description - 奖品描述
 * @property {boolean} in_redeem - 是否处于兑换状态 (已消费但未兑换为 true, 兑换后恢复默认 false)
 */
interface JifenGoodsItem {
  id: number
  name: string
  cover: string
  count: number
  price: number
  description: string
  in_redeem: boolean
}

/**
 * @description 获取积分总数响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-470226524
 */
export interface JifenGetResponse {
  jifen: number
}

/**
 * @description 获取积分记录请求
 * @see https://app.apifox.com/link/project/8311217/apis/api-470236473
 */
export interface JifenGetRecordRequest {
  page: number
  size: number
}

/**
 * @description 获取积分记录响应
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
