import type { IndexCardSettingRequestData, TableSettingRequestData } from "@/apis/models/me"
import type { CommonSetting, IndexCardSetting, TableSetting } from "@/types/setting"

/**
 * @description 转换 API 返回的首页卡片设置为内部格式
 * @param data - API 返回的下划线格式设置
 */
export function convertIndexCardSetting(data: IndexCardSettingRequestData): IndexCardSetting {
  return {
    version: data.version,
    setting: {
      cards: data.setting.cards,
    },
  }
}

/**
 * @description 转换 API 返回的课表设置为内部格式
 * @param data - API 返回的下划线格式设置
 */
export function convertTableSetting(data: TableSettingRequestData): TableSetting {
  return {
    version: data.version,
    setting: {
      displayNotCurrentWeekCourses: data.setting.display_not_current_week_courses,
    },
  }
}

/**
 * @description 根据 version 获取最新设置
 * @param apiData - API 返回的设置
 * @param storageData - 本地存储的设置
 * @param configData - 默认配置
 * @returns 三个数据源中 version 最大的设置
 */
export function pickLatestSetting<T extends object>(
  apiData: CommonSetting<T> | null,
  storageData: CommonSetting<T> | null,
  configData: CommonSetting<T>,
): CommonSetting<T> {
  const v1 = apiData?.version ?? 0
  const v2 = storageData?.version ?? 0
  const v3 = configData.version
  if (v1 >= v2 && v1 >= v3)
    return apiData ?? configData
  if (v2 >= v1 && v2 >= v3)
    return storageData ?? configData
  return configData
}
