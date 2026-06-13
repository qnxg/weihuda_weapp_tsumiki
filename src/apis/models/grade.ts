import type { Semester } from "@/types/semester"

/**
 * @description 成绩项
 * @property {string} course_id - 课程 ID
 * @property {string} course_name - 课程名称
 * @property {number} credit - 学分
 * @property {number} gpa - 绩点
 * @property {number} score - 成绩
 * @property {string} course_type1 - 课程类型 1, 必修 / 选修等
 * @property {string} course_type2 - 课程类型 2, 专业基础 / 专业核心 等
 * @property {string[]} tags - 成绩标识, 正常为 null, 缓考 / 重修 等
 * @property {string} grade_type - 成绩类型, 主修 / 辅修 等
 * @property {string} jx0404id - 用于获取成绩详情的唯一 id
 */
export interface GradeItem {
  course_id: string
  course_name: string
  credit: number
  gpa: number | null
  score: number
  course_type1: string
  course_type2: string
  grade_tag: string | null
  grade_type: string
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
