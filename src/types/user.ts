export type Sex = "Male" | "Female"

/**
 * @description 用户信息
 * @property {string} name - 姓名
 * @property {Sex} sex - 性别
 * @property {number} enter - 入学年份
 * @property {string} stu_id - 学号
 */
export interface UserInfo {
  name: string
  sex: Sex
  enter: number
  stu_id: string
}
