import type { IndexCardSetting } from "@/types/setting"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CARD_METAS } from "@/config/card"
import { SETTINGS } from "@/config/setting"
import { useSetting } from "@/hooks/setting"

/**
 * @description 排序列表中的单个卡片项
 * @property {string} key - 卡片唯一标识
 * @property {string} name - 卡片中文名称
 * @property {boolean} enabled - 是否启用
 */
export interface CardSortItem {
  key: string
  name: string
  enabled: boolean
}

/**
 * @description 首页卡片排序 Hook 返回值
 * @property {CardSortItem[]} items - 当前排序后的卡片列表
 * @property {boolean} isLoading - 初始加载状态
 * @property {boolean} isUpdating - 是否正在保存
 * @property {(from: number, to: number) => void} moveItem - 拖拽移动项
 * @property {(index: number) => void} toggleItem - 切换启用 / 禁用
 * @property {() => void} selectAll - 全选
 * @property {() => void} deselectAll - 全不选
 * @property {() => void} resetToDefault - 重置为默认
 * @property {() => Promise<void>} save - 保存设置, 失败时抛出错误
 */
export interface CardSortHookResult {
  items: CardSortItem[]
  isLoading: boolean
  isUpdating: boolean
  moveItem: (from: number, to: number) => void
  toggleItem: (index: number) => void
  selectAll: () => void
  deselectAll: () => void
  resetToDefault: () => void
  save: () => Promise<void>
}

// 所有可用卡片的 key 与 name 的映射
const CARD_NAME_MAP: Record<string, string> = Object.fromEntries(
  CARD_METAS.map(c => [c.key, c.name]),
)

// 默认配置中的卡片顺序
const DEFAULT_ORDER: string[] = SETTINGS.indexCardSetting!.setting.cards

// 所有卡片的 key 列表, 按默认顺序排列 (含默认未启用的)
const ALL_CARD_KEYS: string[] = [
  ...DEFAULT_ORDER,
  ...CARD_METAS.map(c => c.key).filter(k => !DEFAULT_ORDER.includes(k)),
]

// 根据 API 返回的启用的卡片 keys, 构建初始排序列表
// 启用的卡片按 API 顺序排在前, 禁用的卡片按默认顺序排在后
function buildInitialItems(enabledKeys: string[]): CardSortItem[] {
  const enabledSet = new Set(enabledKeys)
  const enabledItems: CardSortItem[] = []
  const disabledItems: CardSortItem[] = []

  // 先按 API 顺序处理启用的卡片
  for (const key of enabledKeys) {
    enabledItems.push({ key, name: CARD_NAME_MAP[key] ?? key, enabled: true })
  }

  // 再按默认顺序处理禁用的卡片
  for (const key of ALL_CARD_KEYS) {
    if (!enabledSet.has(key)) {
      disabledItems.push({ key, name: CARD_NAME_MAP[key] ?? key, enabled: false })
    }
  }

  return [...enabledItems, ...disabledItems]
}

/**
 * @description 首页卡片排序 Hook
 * 管理卡片启用 / 禁用状态和排序, 与 useSetting 中的 indexCardSetting 同步
 */
export function useCardSort(): CardSortHookResult {
  const { settings, isLoading: isSettingLoading, isUpdating: isSettingUpdating, updateIndexCardSetting } = useSetting()

  // mount 时若 context 已就绪, initializer 直接用真实值算好 items, 首帧即正确
  const [items, setItems] = useState<CardSortItem[]>(() =>
    buildInitialItems(settings.indexCardSetting?.setting.cards ?? DEFAULT_ORDER),
  )

  const [isSaving, setIsSaving] = useState(false)

  // 标记 items 是否已由真实 context 值初始化过, 初值取 mount 时 context 是否就绪. 用途有二:
  //   1. context 延迟就绪 (app 首次启动) 时, 由下方 effect 补一次初始化; mount 时已就绪则 initializer 已完成, effect 跳过, 避免冗余 setItems;
  //   2. save 成功后 updateIndexCardSetting 会回写 context 触发本 effect,
  //      此时必须跳过, 否则会用服务器值覆盖用户当前的本地排序编辑.
  const initializedRef = useRef(!!settings.indexCardSetting)

  // context 延迟就绪时补齐一次初始化 (mount 时已就绪则由 initializer 完成, 此处跳过)
  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    const setting = settings.indexCardSetting
    if (setting) {
      setItems(buildInitialItems(setting.setting.cards))
      initializedRef.current = true
    }
  }, [settings.indexCardSetting])

  const isUpdating = isSettingUpdating || isSaving

  // 拖拽移动: 将 from 位置的项移到 to 位置
  const moveItem = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  // 切换启用 / 禁用
  const toggleItem = useCallback((index: number) => {
    setItems((prev) => {
      const item = prev[index]
      if (!item) {
        return prev
      }

      const next = prev.filter((_, i) => i !== index)
      const toggled: CardSortItem = { ...item, enabled: !item.enabled }

      if (toggled.enabled) {
        // 重新启用: 放到启用区末尾 (最后一个 enabled 项之后)
        const lastEnabledIndex = next.findLastIndex(i => i.enabled)
        next.splice(lastEnabledIndex + 1, 0, toggled)
      }
      else {
        // 禁用: 放到最末尾
        next.push(toggled)
      }

      return next
    })
  }, [])

  // 全选: 所有项 enabled = true, 保持当前顺序
  const selectAll = useCallback(() => {
    setItems(prev => prev.map(i => ({ ...i, enabled: true })))
  }, [])

  // 全不选: 所有项 enabled = false, 保持当前顺序
  const deselectAll = useCallback(() => {
    setItems(prev => prev.map(i => ({ ...i, enabled: false })))
  }, [])

  // 重置为默认: 恢复默认启用顺序和启用状态
  const resetToDefault = useCallback(() => {
    setItems(buildInitialItems(DEFAULT_ORDER))
  }, [])

  // 保存: 将当前 enabled 卡片 keys 按顺序提交
  const save = useCallback(async () => {
    const enabledKeys = items.filter(i => i.enabled).map(i => i.key)
    const currentSetting = settings.indexCardSetting

    const newSetting: IndexCardSetting = {
      version: currentSetting?.version ?? 1,
      setting: { cards: enabledKeys },
    }

    setIsSaving(true)
    try {
      await updateIndexCardSetting(newSetting)
    }
    finally {
      setIsSaving(false)
    }
  }, [items, settings.indexCardSetting, updateIndexCardSetting])

  return useMemo(() => ({
    items,
    isLoading: isSettingLoading,
    isUpdating,
    moveItem,
    toggleItem,
    selectAll,
    deselectAll,
    resetToDefault,
    save,
  }), [items, isSettingLoading, isUpdating, moveItem, toggleItem, selectAll, deselectAll, resetToDefault, save])
}
