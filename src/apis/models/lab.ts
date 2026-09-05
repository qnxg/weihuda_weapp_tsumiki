import type { XN, XQ } from "@/types/semester"

/**
 * @description 大物实验平台支持的学期
 */
export type LabSemester = Extract<XQ, "autumn" | "spring">

/**
 * @description 大物实验成绩组成项
 * @property {string} name - 成绩组成名称
 * @property {number | null} score - 分数, null 表示暂无成绩
 */
export interface LabGradeDetailItem {
  name: string
  score: number | null
}

/**
 * @description 单项大物实验成绩
 * @property {string} lab_name - 实验名称
 * @property {string} score - 实验成绩
 * @property {string | null} attendance - 出勤情况
 * @property {LabGradeDetailItem[]} details - 成绩具体组成
 */
export interface LabGradeItem {
  lab_name: string
  score: string
  attendance: string | null
  details: LabGradeDetailItem[]
}

/**
 * @description 大物实验课程成绩
 * @property {string} course_name - 本学期大物实验课程名称
 * @property {string | null} course_score - 课程成绩
 * @property {LabGradeItem[]} labs - 该课程下所有实验的成绩
 */
export interface LabGrade {
  course_name: string
  course_score: string | null
  labs: LabGradeItem[]
}

/**
 * @description 获取大物实验成绩请求数据
 * @property {XN} xn - 学年起始年份
 * @property {LabSemester} xq - 学期, 仅支持秋季学期和春季学期
 * @see https://app.apifox.com/link/project/8311217/apis/api-480668653
 */
export interface LabGradeRequest {
  xn: XN
  xq: LabSemester
}

/**
 * @description 获取大物实验成绩响应数据, null 表示该学期无课程
 * @see https://app.apifox.com/link/project/8311217/apis/api-480668653
 */
export type LabGradeResponse = LabGrade | null
