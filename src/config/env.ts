/**
 * @description 环境变量配置
 * @property {string} BASE_URL - API 基础 URL
 * @property {number} LOG_LEVEL - 日志级别, -1: 无日志, 0: 严重错误, 1: 错误, 2: 警告, 3: 信息, 4: 调试 (默认为 4)
 * @property {number} STORAGE_EXPIRED_TIME - 存储过期时间, 单位 ms, 默认为 7 天
 */
export const ENV = {
  // eslint-disable-next-line node/prefer-global/process
  BASE_URL: process.env.TARO_APP_BASE_URL ?? "",
  // eslint-disable-next-line node/prefer-global/process
  LOG_LEVEL: process.env.TARO_APP_LOG_LEVEL ? Number.parseInt(process.env.TARO_APP_LOG_LEVEL) : 4,
  // eslint-disable-next-line node/prefer-global/process
  STORAGE_EXPIRED_TIME: process.env.TARO_APP_STORAGE_EXPIRED_TIME ? Number.parseInt(process.env.TARO_APP_STORAGE_EXPIRED_TIME) : 7 * 24 * 3600 * 1000, // 默认7天
}
