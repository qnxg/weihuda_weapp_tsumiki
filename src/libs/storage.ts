import Taro from "@tarojs/taro"
import { LABEL } from "@/config/logger-label"
import { logger } from "@/libs/logger"

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
export class MyStorage<T> {
  key: string

  constructor(key: string, value?: T) {
    this.key = key

    if (value !== undefined) {
      void this.set(value)
    }
  }

  async get(): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, _) => {
      Taro.getStorage({
        key: this.key,
        success: res => resolve(res.data as T),
        fail: (err) => {
          logger.error(LABEL.lib.storage, `${this.key}: `, err)
          resolve(undefined)
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage, `${this.key}: `, error)
        resolve(undefined)
      })
    })
  }

  async set(value: T): Promise<void> {
    return new Promise<void>((resolve, _) => {
      Taro.setStorage({
        key: this.key,
        data: value,
        success: () => resolve(),
        fail: (err) => {
          logger.error(LABEL.lib.storage, `${this.key}: `, err)
          resolve()
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage, `${this.key}: `, error)
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
          logger.error(LABEL.lib.storage, `${this.key}: `, err)
          resolve()
        },
      }).catch((error) => {
        logger.error(LABEL.lib.storage, `${this.key}: `, error)
        resolve()
      })
    })
  }
}
