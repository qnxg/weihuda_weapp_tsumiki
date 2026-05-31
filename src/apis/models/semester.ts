import type { Semester, SemesterInfo, Year } from "@/types/semester"

/**
 * @description 学期请求
 * @property {Year} year 学年
 * @property {Semester} semester 学期
 * @see https://app.apifox.com/link/project/8311217/apis/api-466089042
 */
export interface SemesterRequest {
  year: Year
  semester: Semester
}

/**
 * @description 学期响应
 * @see https://app.apifox.com/link/project/8311217/apis/api-466089042
 */
export type SemesterResponse = SemesterInfo
