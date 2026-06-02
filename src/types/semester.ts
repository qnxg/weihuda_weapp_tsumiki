/**
 * @description 学期定义
 *   - autumn: 秋季学期
 *   - winter: 寒假
 *   - spring: 春季学期
 *   - summer: 暑假 (含小学期)
 */
export type XQ = "autumn" | "winter" | "spring" | "summer"

/**
 * @description 学年定义
 *   以学期开始年份定义, 例如 2025-2026 学年定义为 2025
 */
export type XN = number

/**
 * @description 学期标识信息, 用于唯一确定一个学期
 */
export interface Semester {
  xn: XN
  xq: XQ
}

/**
 * @description 学期信息
 * @property {XN} xn 学年
 * @property {XQ} xq 学期
 * @property {string} start 学期开始日期, 格式为 "YYYY-MM-DD"
 * @property {number} weeks 学期周数
 * @property {boolean} from_zero 学期周数是否从 0 开始, 如果为 true, 则第一周为 0, 否则第一周为 1
 */
export interface SemesterInfo {
  xn: XN
  xq: XQ
  start: string
  weeks: number
  from_zero: boolean
}
