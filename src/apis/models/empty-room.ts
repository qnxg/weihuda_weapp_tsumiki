/**
 * @description 空教室项
 * @property {string} room_name - 教室名称
 * @property {string} room_type - 教室类型
 * @property {number} seat_count - 教室座位数
 * @property {string} exam_seat_count - 考试座位数
 */
export interface EmptyRoomItem {
  room_name: string
  room_type: string
  seat_count: number
  exam_seat_count: string
}

/**
 * @description 查询空教室请求
 * @property {string} building_id - 教学楼 id, 参考 hnu_query 文档
 * @property {string} time - 节次信息, 多个节次用逗号分割, 可选节次参考 hnu_query 文档
 * @property {string} date - 查询日期, yyyy-mm-dd 格式
 * @see https://app.apifox.com/link/project/8311217/apis/api-480789909
 */
export interface EmptyRoomRequest {
  building_id: string
  time: string
  date: string
}

/**
 * @description 查询空教室响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-480789909
 */
export type EmptyRoomResponse = EmptyRoomItem[]
