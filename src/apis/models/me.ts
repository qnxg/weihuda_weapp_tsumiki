/**
 * @interface MeResponse - 用户信息响应
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
