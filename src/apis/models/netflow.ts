/**
 * @description 本月流量信息响应
 * @property {number} overdue_payment - 欠费
 * @property {string} total - 总用量
 * @property {string} upload - 上传用量
 * @property {string} download - 下载用量
 * @property {string} base_amount - 免费流量额度
 * @property {number} base_usage - 免费流量用量
 * @property {number} base_percentage - 免费流量使用率
 * @property {number} extend_usage - 超出流量用量
 * @property {boolean} is_locked - 锁定状态
 * @see https://app.apifox.com/link/project/8311217/apis/api-471721360
 */
export interface MonthNetflowResponse {
  overdue_payment: number
  total: string
  upload: string
  download: string
  base_amount: string
  base_usage: number
  base_percentage: number
  extend_usage: number
  is_locked: boolean
}

/**
 * @description 流量账单项
 * @property {number} year - 年
 * @property {number} month - 月
 * @property {string} download - 下载流量
 * @property {string} upload - 上传流量
 * @property {string} over - 超出流量
 * @property {number} amount - 需缴费用
 * @property {string} updated_at - 更新时间
 */
export interface NetflowOrderItem {
  year: number
  month: number
  download: string
  upload: string
  over: string
  amount: number
  updated_at: string
}

/**
 * @description 流量明细项
 * @property {string} app - 应用名称
 * @property {string} total - 总用量
 * @property {string} download - 下载用量
 * @property {string} upload - 上传用量
 * @property {number} percentage - 占比
 */
export interface NetflowDetailItem {
  app: string
  total: string
  download: string
  upload: string
  percentage: number
}

/**
 * @description 流量账单响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-471721366
 */
export type NetflowOrderResponse = NetflowOrderItem[]

/**
 * @description 流量明细请求
 * @property {number} year - 年
 * @property {number} month - 月
 * @property {number} [day] - 日，不提供该值则为按月查询，否则为按天查询
 * @see https://app.apifox.com/link/project/8311217/apis/api-471721458
 */
export interface NetflowDetailRequest {
  year: number
  month: number
  day?: number
}

/**
 * @description 流量明细响应
 * @property {string} total - 总用量
 * @property {string} upload - 上传用量
 * @property {string} download - 下载用量
 * @property {NetflowDetailItem[]} items - 明细项列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-471721458
 */
export interface NetflowDetailResponse {
  total: string
  upload: string
  download: string
  items: NetflowDetailItem[]
}
