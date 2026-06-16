import type { XN, XQ } from "@/types/semester"

/**
 * @description 学年名称正则表达式, 匹配格式: "2024 - 2025 学年"
 */
export const XN_NAME_REGEX = /^(\d{4}) - (\d{4}) 学年/

/**
 * @description 根据学年获取学年名称
 */
export function getXNName(xn: XN): string {
  return `${xn} - ${xn + 1} 学年`
}

/**
 * @description 根据学期标识符获取学期名称
 */
export function getXQName(xq: XQ): string {
  switch (xq) {
    case "autumn": return "秋季学期"
    case "spring": return "春季学期"
    case "summer": return "夏季学期"
    default: return "未知学期"
  }
}

/**
 * @description 从学年名称解析学年值
 */
export function getXNFromName(name: string): XN | undefined {
  const match = name.match(XN_NAME_REGEX)
  if (!match)
    return undefined
  return Number.parseInt(match[1], 10)
}

/**
 * @description 从学期名称获取学期标识符
 */
export function getXQFromName(name: string): "autumn" | "spring" | "summer" | undefined {
  switch (name) {
    case "全部学期": return undefined
    case "秋季学期": return "autumn"
    case "春季学期": return "spring"
    case "夏季学期": return "summer"
    default: return undefined
  }
}
