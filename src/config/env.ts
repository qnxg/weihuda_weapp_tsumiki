export const ENV = {
  BASE_URL: process.env.TARO_APP_BASE_URL ?? "",
  LOG_LEVEL: process.env.TARO_APP_LOG_LEVEL ? Number.parseInt(process.env.TARO_APP_LOG_LEVEL) : 4,
}
