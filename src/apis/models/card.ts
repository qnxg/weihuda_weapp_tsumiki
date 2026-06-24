/**
 * @description 获取校园卡信息响应
 * @property {number} id - 校园卡 ID
 * @property {number} balance - 校园卡余额
 * @see https://app.apifox.com/link/project/8311217/apis/api-465882786
 */
export interface CardInfoResponse {
  id: number
  balance: number
}

/**
 * @description 校园卡账单记录项
 * @property {string} date_time - 交易时间
 * @property {string} journal_time - 记账时间
 * @property {string} status - 交易状态, 如 "正常"
 * @property {number} id - 交易 ID
 * @property {number} now_balance - 交易后余额
 * @property {number} amount - 交易金额, 充值为正数, 消费为负数
 * @property {string} location - 交易地点
 * @property {string} name - 交易名称
 */
export interface CardHistoryItem {
  date_time: string
  journal_time: string
  status: string
  id: number
  now_balance: number
  amount: number
  location: string
  name: string
}

/**
 * @description 校园卡账单记录请求类型枚举
 *   - recharge: 充值
 *   - consumption: 消费
 */
export type CardRecordRequestType = "recharge" | "consumption"

/**
 * @description 获取校园卡账单记录请求
 * @property {number} [year] - 年份, 可选
 * @property {number} [month] - 月份, 可选
 * @property {CardRecordRequestType} [type] - 交易类型, 可选, recharge 表示充值, consumption 表示消费
 * @see https://app.apifox.com/link/project/8311217/apis/api-465883014
 */
export interface CardRecordRequest {
  year?: number
  month?: number
  type?: CardRecordRequestType
}

/**
 * @description 获取校园卡账单记录响应
 * @property {number} total - 交易总金额, 充值为正数, 消费为负数
 * @property {number} count - 交易数量
 * @property {CardHistoryItem[]} items - 交易记录列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-465883014
 */
export interface CardRecordResponse {
  total: number
  count: number
  records: CardHistoryItem[]
}
