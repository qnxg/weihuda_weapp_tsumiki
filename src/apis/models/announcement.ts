/**
 * @description 公告项
 * @property {number} id - 公告 ID
 * @property {string} title - 公告标题
 * @property {string | null} url - 公告跳转链接
 * @property {string} content - 公告内容
 * @property {string} created_at - 发布时间
 */
export interface AnnouncementItem {
  id: number
  title: string
  url: string | null
  content: string
  created_at: string
}

/**
 * @description 获取公告响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-462318526
 */
export type AnnouncementResponse = AnnouncementItem[]
