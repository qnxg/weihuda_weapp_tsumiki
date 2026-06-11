import type { Semester } from "@/types/semester"

/**
 * @description 成绩项
 * @property {string} course_id - 课程 ID
 * @property {string} course_name - 课程名称
 * @property {number} credit - 学分
 * @property {number} gpa - 绩点
 * @property {number} score - 成绩
 * @property {string} type1 - 类型 1, 必修 / 选修等
 * @property {string} type2 - 类型 2, 专业基础 / 专业核心等
 * @property {string[]} tags - 标签
 * @property {string} jx0404id - 用于获取成绩详情的唯一 id
 */
export interface GradeItem {
  course_id: string
  course_name: string
  credit: number
  gpa: number
  score: number
  type1: string
  type2: string
  tags: string[]
  jx0404id: string | null
}

/**
 * @description 成绩详情项
 * @property {string} name - 成绩组成名称
 * @property {string} score - 成绩
 * @property {string} percentage - 百分比
 */
export interface GradeDetailItem {
  name: string
  score: string
  percentage: string
}

/**
 * @description 获取成绩请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-471308909
 */
export type GradeRequest = Semester

/**
 * @description 获取成绩响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-471308909
 */
export type GradeResponse = GradeItem[]

/**
 * @description 获取成绩详情响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-471335079
 */
export type GradeDetailResponse = GradeDetailItem[]
