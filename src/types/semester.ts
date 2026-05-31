/**
 * @description 学期定义
 *   - autumn: 秋季学期
 *   - winter: 寒假
 *   - spring: 春季学期
 *   - summer: 暑假 (含小学期)
 */
export type Semester = "autumn" | "winter" | "spring" | "summer"

/**
 * @description 学年定义
 *   以学期开始年份定义, 例如 2025-2026 学年定义为 2025
 */
export type Year = number

/**
 * @description 学期标识信息, 用于唯一确定一个学期
 */
export interface SemesterIdentifier {
  year: Year
  semester: Semester
}

/**
 * @description 学期信息
 * @property {Year} year 学年
 * @property {Semester} semester 学期
 * @property {string} start 学期开始日期, 格式为 "YYYY-MM-DD"
 * @property {number} weeks 学期周数
 */
export interface SemesterInfo {
  year: Year
  semester: Semester
  start: string
  weeks: number
}
