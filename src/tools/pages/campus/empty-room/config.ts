import { od } from "@/utils/ohday"

/**
 * @description 教学楼信息
 * @property {string} id - 教学楼 id
 * @property {string} name - 教学楼名称
 * @see https://github.com/qnxg/hnu_query/blob/main/docs/hdjw/building.md
 */
export interface Building {
  id: string
  name: string
}

/**
 * @description 教学楼列表, 来源 hnu_query 楼栋文档
 */
export const BUILDINGS: Building[] = [
  { id: "106", name: "综合楼" },
  { id: "302", name: "研究生楼" },
  { id: "102", name: "复临舍" },
  { id: "123", name: "中楼" },
  { id: "122", name: "东楼" },
  { id: "201", name: "梯教(北校区)" },
  { id: "202", name: "二教楼(北校区)" },
  { id: "203", name: "电子楼(北校区)" },
  { id: "204", name: "水上教学楼(北校区)" },
  { id: "W134b2a60000WH", name: "综合楼机房" },
  { id: "117", name: "南楼" },
  { id: "121", name: "北楼" },
  { id: "W13463510000WH", name: "二院" },
  { id: "W1343d740000WH", name: "天马园区排练厅" },
  { id: "W134153a0000WJ", name: "物理院楼" },
  { id: "W134153a0000WK", name: "数学院楼" },
  { id: "W13463550000WH", name: "生物院楼" },
  { id: "132", name: "工训中心" },
  { id: "W1343be60000WH", name: "工训中心B栋" },
  { id: "W1343cb40000WH", name: "工训中心C栋" },
  { id: "W1343dd90000WJ", name: "工训中心D栋" },
  { id: "W1343dd90000WH", name: "工训中心E栋" },
  { id: "W1343dd90000WI", name: "工训中心F栋" },
  { id: "115", name: "工管院院楼" },
  { id: "105", name: "信科院院楼(软件大楼)" },
  { id: "125", name: "法学楼" },
  { id: "129", name: "机械院院楼" },
  { id: "130", name: "电气院院楼" },
  { id: "131", name: "建筑学院" },
  { id: "W134153a0000WH", name: "生物院U型楼" },
  { id: "W134153a0000WI", name: "岳麓书院" },
  { id: "W134153a0000WL", name: "材料院楼" },
  { id: "W134153a0000WM", name: "外语院楼" },
  { id: "W134153a0000WN", name: "土木院楼" },
  { id: "W1348a680000WH", name: "公共管理学院楼" },
  { id: "W1348ab90000WH", name: "马院院楼" },
  { id: "W13415380000WH", name: "环境馆" },
  { id: "W13415380000WI", name: "培训小楼(文学院)" },
  { id: "127", name: "继教综合楼" },
  { id: "128", name: "工程实验大楼" },
  { id: "133", name: "逸夫楼" },
  { id: "W13416c50000WH", name: "化学实验中心" },
  { id: "101", name: "办公楼" },
  { id: "134", name: "南校区图书馆" },
  { id: "135", name: "桃子湖教学区" },
  { id: "W13414dd0000WH", name: "四合院子" },
  { id: "W1343be60000WI", name: "麓谷湖大科技园" },
  { id: "W1343cab0000WH", name: "校外实验实践场所" },
  { id: "W1348a6d0000WH", name: "经贸大楼(北校区)" },
  { id: "W134634f0000WH", name: "财院校区排练厅(北校区)" },
  { id: "W13463550000WI", name: "中四栋" },
  { id: "W13417fe0000WH", name: "艺术教育中心" },
  { id: "126", name: "南校区体育馆" },
]

/**
 * @description 大节次信息
 * @property {number} index - 大节次序号, 从 1 开始
 * @property {string} label - 展示名称
 * @property {string} start - 开始时间, HH:mm
 * @property {string} end - 结束时间, HH:mm
 * @see https://github.com/qnxg/hnu_query/blob/main/docs/hdjw/time.md
 */
export interface MajorPeriod {
  index: number
  label: string
  start: string
  end: string
}

/**
 * @description 大节次列表, 接口 time 参数按大节次传值
 */
export const MAJOR_PERIODS: MajorPeriod[] = [
  { index: 1, label: "第 1 大节", start: "08:00", end: "09:40" },
  { index: 2, label: "第 2 大节", start: "10:00", end: "11:40" },
  { index: 3, label: "第 3 大节", start: "14:30", end: "16:00" },
  { index: 4, label: "第 4 大节", start: "16:10", end: "17:40" },
  { index: 5, label: "第 5 大节", start: "19:00", end: "21:35" },
  { index: 6, label: "第 6 大节", start: "21:35", end: "22:20" },
]

/**
 * @description 将 HH:mm 转为当日分钟数
 */
function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

/**
 * @description 根据当前时间预选大节次
 * - 处于某大节次时间段内时选中该大节
 * - 处于课间时选中下一即将开始的大节
 * - 早于第一节时选中第 1 大节
 * - 晚于最后一节时选中第 6 大节
 */
export function getDefaultMajorPeriods(now = od()): number[] {
  const current = now.hour * 60 + now.minute

  const currentPeriod = MAJOR_PERIODS.find((period) => {
    const start = toMinutes(period.start)
    const end = toMinutes(period.end)
    return current >= start && current <= end
  })
  if (currentPeriod)
    return [currentPeriod.index]

  const nextPeriod = MAJOR_PERIODS.find(period => current < toMinutes(period.start))
  if (nextPeriod)
    return [nextPeriod.index]

  return [MAJOR_PERIODS.at(-1)!.index]
}

/**
 * @description 将大节次序号列表格式化为接口 time 参数
 */
export function formatMajorPeriods(periods: number[]): string {
  return [...periods].sort((a, b) => a - b).join(",")
}

/**
 * @description 将大节次序号列表格式化为展示文案, 如 "第 1 / 2 大节"
 */
export function formatMajorPeriodLabel(periods: number[]): string {
  const sorted = [...periods].sort((a, b) => a - b)
  if (sorted.length === 0)
    return ""
  if (sorted.length === 1)
    return `第 ${sorted[0]} 大节`
  return `第 ${sorted.join(" / ")} 大节`
}
