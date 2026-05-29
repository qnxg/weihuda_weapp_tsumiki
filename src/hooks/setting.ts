import type { IndexCardSettingRequestData, MeSettingResponse, TableSettingRequestData } from "@/apis/models/me"
import type { IndexCardSetting, TableSetting } from "@/store/setting"
import { useCallback, useEffect, useMemo } from "react"
import { api } from "@/apis"
import { LABEL } from "@/config/logger-label"
import { SETTINGS } from "@/config/setting"
import { STORAGE } from "@/config/storage-key"
import { useSettingStore } from "@/store/setting"
import { logger } from "@/utils/logger"
import { convertIndexCardSetting, convertTableSetting, pickLatestSetting } from "@/utils/setting"
import { Storage } from "@/utils/storage"

/**
 * @description 全部设置数据类型
 * @property {IndexCardSetting | null} indexCardSetting - 首页卡片设置
 * @property {TableSetting | null} tableSetting - 课表设置
 */
export interface Setting {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
}

/**
 * @property {Setting} settings - 当前所有设置
 * @property {boolean} isLoading - 初始加载状态, mount 时为 true, 数据就绪后为 false
 * @property {boolean} isUpdating - 更新状态, 任一 update 进行中为 true, 全部结束为 false
 * @property {(setting: IndexCardSetting) => Promise<void>} updateIndexCardSetting - 更新首页卡片设置, 失败时抛出错误
 * @property {(setting: TableSetting) => Promise<void>} updateTableSetting - 更新课表设置, 失败时抛出错误
 */
export interface SettingHookResult {
  settings: Setting
  isLoading: boolean
  isUpdating: boolean
  updateIndexCardSetting: (setting: IndexCardSetting) => Promise<void>
  updateTableSetting: (setting: TableSetting) => Promise<void>
}

const indexCardSettingStorage = new Storage<IndexCardSetting>(STORAGE.setting.index_card)
const tableSettingStorage = new Storage<TableSetting>(STORAGE.setting.table)

/**
 * @description 用户设置 Hook
 *   - mount 时自动请求服务器获取设置, 并从本地存储读取设置, 取 version 最大的生效
 *   - 更新时会同步到服务器和本地存储, 失败时抛出错误不更新本地
 */
export function useSetting(): SettingHookResult {
  const {
    indexCardSetting,
    tableSetting,
    isLoading,
    isUpdating,
    setIndexCardSetting,
    setTableSetting,
    setIsLoading,
    setIsUpdating,
  } = useSettingStore()

  const settings = useMemo<Setting>(() => ({
    indexCardSetting,
    tableSetting,
  }), [indexCardSetting, tableSetting])

  const init = useCallback(async () => {
    setIsLoading(true)

    const apiPromise = api.me.setting.get().then(res => res.data).catch((error) => {
      logger.error(LABEL.hook.setting.FETCH_ERROR, error)
      return null
    })

    const [indexCardSettingStorageData, tableSettingStorageData] = await Promise.all([
      indexCardSettingStorage.get().catch(() => null).then(v => v ?? null),
      tableSettingStorage.get().catch(() => null).then(v => v ?? null),
    ])

    const apiData: MeSettingResponse | null = await apiPromise

    const indexCardSetting = pickLatestSetting(
      apiData?.index_card_setting ? convertIndexCardSetting(apiData.index_card_setting) : null,
      indexCardSettingStorageData,
      SETTINGS.indexCardSetting!,
    )
    const tableSetting = pickLatestSetting(
      apiData?.table_setting ? convertTableSetting(apiData.table_setting) : null,
      tableSettingStorageData,
      SETTINGS.tableSetting!,
    )

    setIndexCardSetting(indexCardSetting)
    setTableSetting(tableSetting)

    if (apiData) {
      await Promise.all([
        indexCardSetting.version > (indexCardSettingStorageData?.version ?? 0)
          ? indexCardSettingStorage.set(indexCardSetting)
          : Promise.resolve(),
        tableSetting.version > (tableSettingStorageData?.version ?? 0)
          ? tableSettingStorage.set(tableSetting)
          : Promise.resolve(),
      ])
    }

    setIsLoading(false)
  }, [setIndexCardSetting, setTableSetting, setIsLoading])

  const updateIndexCardSetting = useCallback(async (setting: IndexCardSetting) => {
    setIsUpdating(true)
    try {
      const requestData: IndexCardSettingRequestData = {
        version: setting.version,
        setting: {
          cards: setting.setting.cards,
        },
      }
      const res = await api.me.setting.putIndexCard(requestData)
      const converted = convertIndexCardSetting(res.data)
      await indexCardSettingStorage.set(converted)
      setIndexCardSetting(converted)
    }
    catch (error) {
      logger.error(LABEL.hook.setting.UPDATE_ERROR, "首页卡片: ", error)
      throw error
    }
    finally {
      setIsUpdating(false)
    }
  }, [setIndexCardSetting, setIsUpdating])

  const updateTableSetting = useCallback(async (setting: TableSetting) => {
    setIsUpdating(true)
    try {
      const requestData: TableSettingRequestData = {
        version: setting.version,
        setting: {
          display_not_current_week_courses: setting.setting.displayNotCurrentWeekCourses,
        },
      }
      const res = await api.me.setting.putTable(requestData)
      const converted = convertTableSetting(res.data)
      await tableSettingStorage.set(converted)
      setTableSetting(converted)
    }
    catch (error) {
      logger.error(LABEL.hook.setting.UPDATE_ERROR, "课表: ", error)
      throw error
    }
    finally {
      setIsUpdating(false)
    }
  }, [setTableSetting, setIsUpdating])

  useEffect(() => {
    if (indexCardSetting === null && tableSetting === null) {
      void init()
    }
  }, [init, indexCardSetting, tableSetting])

  return {
    settings,
    isLoading,
    isUpdating,
    updateIndexCardSetting,
    updateTableSetting,
  }
}
