/**
 * @description 小节次信息
 * @property {number} index - 小节次序号, 从 1 开始
 * @property {string} start - 开始时间, 格式为 "HH:mm"
 * @property {string} end - 结束时间, 格式为 "HH:mm"
 * @see https://github.com/qnxg/hnu_query/blob/main/docs/hdjw/time.md
 */
interface ScheduleItem {
  index: number
  start: string
  end: string
}

/**
 * @description 小节次列表
 */
export const SCHEDULES: ScheduleItem[] = [
  { index: 1, start: "08:00", end: "08:45" },
  { index: 2, start: "08:55", end: "09:40" },
  { index: 3, start: "10:00", end: "10:45" },
  { index: 4, start: "10:55", end: "11:40" },
  { index: 5, start: "14:30", end: "15:15" },
  { index: 6, start: "15:15", end: "16:00" },
  { index: 7, start: "16:10", end: "16:55" },
  { index: 8, start: "16:55", end: "17:40" },
  { index: 9, start: "19:00", end: "19:45" },
  { index: 10, start: "19:55", end: "20:40" },
  { index: 11, start: "20:50", end: "21:35" },
  { index: 12, start: "21:35", end: "22:20" },
]

/**
 * @description 大节次信息
 * @property {number} index - 大节次序号, 从 1 开始
 * @property {string} start - 开始时间, HH:mm
 * @property {string} end - 结束时间, HH:mm
 * @see https://github.com/qnxg/hnu_query/blob/main/docs/hdjw/time.md
 */
export interface MajorPeriod {
  index: number
  start: string
  end: string
}

/**
 * @description 大节次列表, 接口 time 参数按大节次传值
 */
export const MAJOR_PERIODS: MajorPeriod[] = [
  { index: 1, start: "08:00", end: "09:40" },
  { index: 2, start: "10:00", end: "11:40" },
  { index: 3, start: "14:30", end: "16:00" },
  { index: 4, start: "16:10", end: "17:40" },
  { index: 5, start: "19:00", end: "21:35" },
  { index: 6, start: "21:35", end: "22:20" },
]
