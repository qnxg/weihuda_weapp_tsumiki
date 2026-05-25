import { ENV } from "@/config/env"

/**
 * @description 通用日志函数
 * @param {(...args: any[]) => void} fn - 用于输出日志的函数
 * @param {number} level - 日志级别 (0为最高级别)
 * @param {string} label - 日志标签 (用于标识日志来源)
 * @param {...any[]} args - 其他日志参数
 */
export function logger(
  fn: (...args: any[]) => void,
  level: number,
  label: string,
  ...args: any[]
) {
  if (level > ENV.LOG_LEVEL)
    return

  fn(`[${level}][${label}]`, ...args)
}

logger.debug = (label: string, ...args: any[]) => logger(console.log, 4, label, ...args)
logger.info = (label: string, ...args: any[]) => logger(console.info, 3, label, ...args)
logger.warn = (label: string, ...args: any[]) => logger(console.warn, 2, label, ...args)
logger.error = (label: string, ...args: any[]) => logger(console.error, 1, label, ...args)
logger.fatal = (label: string, ...args: any[]) => logger(console.error, 0, label, ...args)
