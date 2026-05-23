import type { ClassValue } from "clsx"
import { clsx } from "clsx"

/**
 * @description shadcn 风格的 className 合并函数
 * @param {ClassValue[]} inputs - 要合并的 className 输入, 支持字符串, 数组, 对象
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
