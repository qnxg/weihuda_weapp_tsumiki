import type { IndexCardSetting, TableSetting } from "@/types/setting"
import { create } from "zustand"

interface SettingStoreValue {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
  isLoading: boolean
  isUpdating: boolean
  setIndexCardSetting: (setting: IndexCardSetting) => void
  setTableSetting: (setting: TableSetting) => void
  setIsLoading: (isLoading: boolean) => void
  setIsUpdating: (isUpdating: boolean) => void
}

export const useSettingStore = create<SettingStoreValue>(set => ({
  indexCardSetting: null,
  tableSetting: null,
  isLoading: true,
  isUpdating: false,
  setIndexCardSetting: setting => set({ indexCardSetting: setting }),
  setTableSetting: setting => set({ tableSetting: setting }),
  setIsLoading: isLoading => set({ isLoading }),
  setIsUpdating: isUpdating => set({ isUpdating }),
}))
