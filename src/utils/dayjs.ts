import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

/**
 * @description 全局安装插件的 dayjs 实例
 *   - customParseFormat
 *   - isBetween
 */
const myDayjs = dayjs

export default myDayjs
export type { Dayjs }
