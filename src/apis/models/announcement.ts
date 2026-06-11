/**
 * @description 公告响应
 * @property {number} id - 公告 ID
 * @property {string} title - 公告标题
 * @property {string | null} url - 公告跳转链接
 * @property {string} content - 公告内容
 * @property {string} create_at - 发布时间
 * @see https://app.apifox.com/link/project/8311217/apis/api-462318526
 */
export interface AnnouncementResponse {
  id: number
  title: string
  url: string | null
  content: string
  create_at: string
}
