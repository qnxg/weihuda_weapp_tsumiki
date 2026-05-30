import type { Sex } from "@/types/user"
import { LABEL } from "@/config/logger-label"
import { logger } from "@/utils/logger"

const SEX_MALE_KEYWORDS = ["male", "男", "m"]
const SEX_FEMALE_KEYWORDS = ["female", "女", "f"]

/**
 * @description 将各种性别字符串解析为 Sex 类型
 * @param {string} sex - 性别字符串
 */
export function parseSex(sex: string): Sex {
  const lower = sex.toLowerCase().trim()

  if (SEX_MALE_KEYWORDS.includes(lower)) {
    return "Male"
  }

  if (SEX_FEMALE_KEYWORDS.includes(lower)) {
    return "Female"
  }

  logger.warn(LABEL.util.parse_sex, `Invalid sex value: ${sex}`)
  return "Male"
}
