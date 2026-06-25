import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import arraySupport from "dayjs/plugin/arraySupport"
import customParseFormat from "dayjs/plugin/customParseFormat"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(arraySupport)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

/**
 * @description 全局安装插件的 dayjs 实例
 *   - arraySupport: 允许向 dayjs 内传入 [year, month] 数组形式的参数
 *   - customParseFormat: 允许自定义格式化字符串解析日期
 *   - isBetween: 提供 isBetween 方法判断日期是否在两个日期之间
 */
const myDayjs = dayjs

export default myDayjs
export type { Dayjs }
