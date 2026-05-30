import type { ReactNode } from "react"
import type { IndexCardSetting, TableSetting } from "@/types/setting"
import { createContext, useContext, useMemo, useState } from "react"

interface SettingContextValue {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
  isLoading: boolean
  isUpdating: boolean
  setIndexCardSetting: (setting: IndexCardSetting) => void
  setTableSetting: (setting: TableSetting) => void
  setIsLoading: (isLoading: boolean) => void
  setIsUpdating: (isUpdating: boolean) => void
}

const SettingContext = createContext<SettingContextValue | null>(null)

export function SettingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [indexCardSetting, setIndexCardSetting] = useState<IndexCardSetting | null>(null)
  const [tableSetting, setTableSetting] = useState<TableSetting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const value = useMemo(() => ({
    indexCardSetting,
    tableSetting,
    isLoading,
    isUpdating,
    setIndexCardSetting,
    setTableSetting,
    setIsLoading,
    setIsUpdating,
  }), [indexCardSetting, tableSetting, isLoading, isUpdating])

  return (
    <SettingContext.Provider value={value}>
      {children}
    </SettingContext.Provider>
  )
}

export function useSettingContext() {
  const context = useContext(SettingContext)
  if (!context) {
    throw new Error("useSettingContext must be used within a SettingProvider")
  }
  return context
}
