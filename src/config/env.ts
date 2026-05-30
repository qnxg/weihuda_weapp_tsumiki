/**
 * @description 环境变量配置
 * @property {string} BASE_URL - API 基础 URL
 * @property {number} LOG_LEVEL - 日志级别, -1: 无日志,, 0: 严重错误, 1: 错误, 2: 警告, 3: 信息, 4: 调试 (默认为 4)
 */
export const ENV = {
  BASE_URL: process.env.TARO_APP_BASE_URL ?? "",
  LOG_LEVEL: process.env.TARO_APP_LOG_LEVEL ? Number.parseInt(process.env.TARO_APP_LOG_LEVEL) : 4,
}
