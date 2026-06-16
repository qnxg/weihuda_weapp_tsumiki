import type { Dayjs } from "dayjs"
import type { Semester, SemesterInfo, XQ } from "@/types/semester"
import dayjs from "@/utils/dayjs"

/**
 * @description 获取下一学期的标识符
 *   - 学期顺序: 秋季学期 -> 寒假 -> 春季学期 -> 暑假 -> 秋季学期 (次年)
 */
export function getNextSemester(semester: Semester): Semester {
  const order: XQ[] = ["autumn", "winter", "spring", "summer"]
  const currentIndex = order.indexOf(semester.xq)
  const nextIndex = (currentIndex + 1) % order.length
  const nextXQValue = order[nextIndex]
  const nextXN = nextXQValue === "autumn" ? semester.xn + 1 : semester.xn
  return { xn: nextXN, xq: nextXQValue }
}

/**
 * @description 获取上一学期的标识符
 */
export function getPrevSemester(semester: Semester): Semester {
  const order: XQ[] = ["autumn", "winter", "spring", "summer"]
  const currentIndex = order.indexOf(semester.xq)
  const prevIndex = (currentIndex - 1 + order.length) % order.length
  const prevXQValue = order[prevIndex]
  const prevXN = prevXQValue === "summer" ? semester.xn - 1 : semester.xn
  return { xn: prevXN, xq: prevXQValue }
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

const SEMESTER_NAME_MAP: Record<XQ, string> = {
  autumn: "秋季学期",
  winter: "寒假",
  spring: "春季学期",
  summer: "暑假(含夏季学期)",
}

/**
 * @description 获取学期完整名称
 * @example
 * ```ts
 * getSemesterName({ xn: 2025, xq: "autumn" }) // "2025-2026秋季学期"
 * ```
 */
export function getSemesterName(semester: Semester | SemesterInfo): string {
  const xn = semester.xn
  const xq = semester.xq
  return `${xn}-${xn + 1}${SEMESTER_NAME_MAP[xq]}`
}

const SEMESTER_NAME_REGEX = /^(\d{4})-(\d{4})(秋季学期|寒假|春季学期|暑假\(含夏季学期\))$/

/**
 * @description 根据学期完整名称获取学期标识符
 * @example
 * ```ts
 * getSemesterFromName("2025-2026秋季学期") // { xn: 2025, xq: "autumn" }
 * ```
 */
export function getSemesterFromName(s: string): Semester | null {
  const match = s.match(SEMESTER_NAME_REGEX)
  if (!match)
    return null
  const xn = Number.parseInt(match[1], 10)
  const name = match[3]
  const xq = (Object.entries(SEMESTER_NAME_MAP).find(([, v]) => v === name)?.[0] as XQ) ?? null
  if (!xq)
    return null
  return { xn, xq }
}
