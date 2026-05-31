import type { Dayjs } from "dayjs"
import type { Semester, SemesterIdentifier, SemesterInfo } from "@/types/semester"
import dayjs from "@/utils/dayjs"

/**
 * @description 获取下一学期的标识符
 *   - 学期顺序: 秋季学期 -> 寒假 -> 春季学期 -> 暑假 -> 秋季学期 (次年)
 */
export function getNextSemester(semester: SemesterIdentifier): SemesterIdentifier {
  const order: Semester[] = ["autumn", "winter", "spring", "summer"]
  const currentIndex = order.indexOf(semester.semester)
  const nextIndex = (currentIndex + 1) % order.length
  const nextSemesterValue = order[nextIndex]
  const nextYear = nextSemesterValue === "autumn" ? semester.year + 1 : semester.year
  return { year: nextYear, semester: nextSemesterValue }
}

/**
 * @description 获取学期日期相关信息
 *   - week: 当前是第几周, 从 1 开始, 不在学期内返回 -1
 *   - passed: 已经过去的天数, 在学期开始前为负数
 *   - next: 还剩多少天, 在学期结束后为负数
 *   - isCurrent: 当前日期是否在学期内
 */
interface GetSemesterDataInfoResult {
  week: number
  passed: number
  next: number
  isCurrent: boolean
}

/**
 * @description 获取学期日期相关信息
 * @param {SemesterInfo} semester 学期信息
 * @param {Dayjs | string} [date] 日期, 默认为当前时间
 */
export function getSemesterDateInfo(
  semester: SemesterInfo,
  date?: Dayjs | string,
): GetSemesterDataInfoResult {
  const current = date ? dayjs(date) : dayjs()
  const start = dayjs(semester.start)
  const end = start.add(semester.weeks * 7, "day")
  const diffDays = current.diff(start, "day")
  const total = semester.weeks * 7
  const week = Math.ceil((diffDays + 1) / 7)
  return {
    week: week >= 1 && week <= semester.weeks ? week : -1,
    passed: diffDays,
    next: total - diffDays,
    isCurrent: current.isBetween(start, end, "day", "[]"),
  }
}

const SEMESTER_NAME_MAP: Record<Semester, string> = {
  autumn: "秋季学期",
  winter: "寒假",
  spring: "春季学期",
  summer: "暑假(含夏季学期)",
}

/**
 * @description 获取学期名称
 * @example
 * ```ts
 * getSemesterName({ year: 2025, semester: "autumn" }) // "2025-2026秋季学期"
 * ```
 */
export function getSemesterName(semester: SemesterIdentifier | SemesterInfo): string {
  const year = semester.year
  const s = semester.semester
  return `${year}-${year + 1}${SEMESTER_NAME_MAP[s]}`
}
