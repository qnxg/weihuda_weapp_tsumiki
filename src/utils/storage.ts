import Taro from "@tarojs/taro"
import { LABEL } from "@/config/logger-label"
import { STORAGE } from "@/config/storage-key"
import dayjs from "@/utils/dayjs"
import { logger } from "@/utils/logger"

/**
 * @description 实际存储结构
 * @template T - 存储数据的类型
 * @property {T} data - 存储的数据
 * @property {string} update_at - 最后更新时间, 为 "YYYY-MM-DD HH:mm:ss" 格式的字符串
 * @property {number | null} expired - 有效期, 单位 ms, null 为永不过期
 */
interface StorageData<T> {
  data: T
  update_at: string
  expired: number | null
}

/**
 * @description 通用存储类
 * @template T - 存储数据的类型
 * @param {string} key - 存储键
 * @param {T} [value] - 可选的初始值, 如果提供则会立即存储
 * @property {string} key - 存储键
 * @property {() => Promise<T | undefined>} get - 获取存储数据
 * @property {(value: T) => Promise<void>} set - 设置存储数据
 * @property {() => Promise<void>} remove - 删除存储数据
 */
export class Storage<T> {
  key: string

  constructor(key: string, value?: T) {
    this.key = key

    if (value !== undefined) {
      void this.set(value)
    }
  }

  async get(): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve) => {
      Taro.getStorage({
        key: this.key,
        success: (res) => {
          const stored = res.data as StorageData<T>
          if (stored?.update_at) {
            if (stored.expired !== null) {
              const diff = dayjs().diff(dayjs(stored.update_at, "YYYY-MM-DD HH:mm:ss"))
              if (diff > stored.expired) {
                logger.warn(LABEL.lib.storage.EXPIRED, `${this.key}: expired`)
                resolve(undefined)
              }
            }
            resolve(stored.data)
          }
          else {
            resolve(stored as T)
          }
        },
        fail: (err) => {
          logger.error(LABEL.lib.storage.GET_ERROR, `${this.key}: `, err)
          resolve(undefined)
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage.GET_ERROR, `${this.key}: `, error)
        resolve(undefined)
      })
    })
  }

  async set(value: T): Promise<void> {
    const storageData: StorageData<T> = {
      data: value,
      update_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      expired: null,
    }

    return new Promise<void>((resolve, _) => {
      Taro.setStorage({
        key: this.key,
        data: storageData,
        success: () => resolve(),
        fail: (err) => {
          logger.error(LABEL.lib.storage.SET_ERROR, `${this.key}: `, err)
          resolve()
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage.SET_ERROR, `${this.key}: `, error)
        resolve()
      })
    })
  }

  async remove(): Promise<void> {
    return new Promise<void>((resolve, _) => {
      Taro.removeStorage({
        key: this.key,
        success: () => resolve(),
        fail: (err) => {
          logger.error(LABEL.lib.storage.GET_ERROR, `${this.key}: `, err)
          resolve()
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage.GET_ERROR, `${this.key}: `, error)
        resolve()
      })
    })
  }
}

/**
 * @description 安全清除缓存需保留的 key
 */
const IMPORTANT_KEYS = [STORAGE.token.access_token, STORAGE.token.refresh_token]

/**
 * @description 安全清除缓存函数
 */
export function clearAllStorage() {
  const keys = Taro.getStorageInfoSync().keys.filter(k => !IMPORTANT_KEYS.includes(k))
  const backup = Taro.batchGetStorageSync(keys).map((v, idx) => ({
    key: keys[idx]!,
    value: v,
  }))
  Taro.clearStorageSync()
  Taro.batchSetStorageSync(backup as any) // Taro 类型问题
}
