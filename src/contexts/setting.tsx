import type { ReactNode } from "react"
import type { IndexCardSetting, TableSetting } from "@/types/setting"
import { createContext, useContext, useMemo, useState } from "react"

interface SettingContextValue {
  indexCardSetting: IndexCardSetting | null
  tableSetting: TableSetting | null
  setIndexCardSetting: (setting: IndexCardSetting) => void
  setTableSetting: (setting: TableSetting) => void
}

const SettingContext = createContext<SettingContextValue | null>(null)

export function SettingProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [indexCardSetting, setIndexCardSetting] = useState<IndexCardSetting | null>(null)
  const [tableSetting, setTableSetting] = useState<TableSetting | null>(null)

  const value = useMemo(() => ({
    indexCardSetting,
    tableSetting,
    setIndexCardSetting,
    setTableSetting,
  }), [indexCardSetting, tableSetting])

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
