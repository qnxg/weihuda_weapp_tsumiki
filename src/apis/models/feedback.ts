/**
 * @description 反馈状态枚举
 */
export type FeedbackStatus = "pending" | "working" | "done"

/**
 * @description 反馈回复项
 * @property {string} msg - 回复内容
 * @property {string} created_at - 回复时间
 * @property {string} stu_id - 回复人学号
 */
export interface FeedbackReplyItem {
  msg: string
  created_at: string
  stu_id: string
}

/**
 * @description 反馈项
 * @property {number} id - 反馈 ID
 * @property {string} contact - 联系方式（电子邮箱）
 * @property {string} description - 内容
 * @property {string} img - 附加图片 ID
 * @property {string} created_at - 创建时间
 * @property {string} updated_at - 最后更新时间
 * @property {FeedbackStatus} status - 状态
 * @property {FeedbackReplyItem[]} replies - 回复列表
 */
export interface FeedbackItem {
  id: number
  contact: string | null
  description: string
  img: string | null
  created_at: string
  updated_at: string
  status: FeedbackStatus
  replies: FeedbackReplyItem[]
}

/**
 * @description 获取反馈列表请求数据
 * @property {number} [page] - 页码，默认为 1
 * @property {number} [size] - 每页返回数量，默认为 20
 * @see https://app.apifox.com/link/project/8311217/apis/api-472411023
 */
export interface FeedbackGetRequest {
  page?: number
  size?: number
}

/**
 * @description 获取反馈列表响应数据
 * @property {number} total - 总数量
 * @property {FeedbackItem[]} items - 反馈列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-472411023
 */
export interface FeedbackGetResponse {
  total: number
  items: FeedbackItem[]
}

/**
 * @description 提交问题反馈请求数据
 * @property {string} contact - 联系方式（电子邮箱）
 * @property {string} description - 内容
 * @property {string} img - 附加图片 ID
 * @see https://app.apifox.com/link/project/8311217/apis/api-472415980
 */
export interface FeedbackPostRequest {
  contact: string
  description: string
  img: string | null
}

/**
 * @description 提交问题反馈响应数据
 */
export type FeedbackPostResponse = never

/**
 * @description 未登录提交问题反馈请求数据
 * @property {string} contact - 联系方式（电子邮箱）
 * @property {string} description - 内容
 * @property {string} stu_id - 学号
 * @see https://app.apifox.com/link/project/8311217/apis/api-472416281
 */
export interface FeedbackNoAuthRequest {
  contact: string
  description: string
  stu_id: string
}
