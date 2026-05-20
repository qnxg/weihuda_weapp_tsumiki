import type { ComponentProps, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import { View } from "@tarojs/components"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { cn } from "@/utils/cn"

interface ContentValue {
  activeTab: string
  onTabChange: (value: string) => void
}

const TabsContext = createContext<ContentValue | null>(null)

function Tabs({
  value: propValue,
  defaultValue = "",
  onChange,
  children,
  ...props
}: Readonly<{
  className?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
} & ComponentProps<typeof View>>) {
  const isControlled = propValue !== undefined
  const [activeTab, setActiveTab] = useState(
    isControlled ? String(propValue) : defaultValue,
  )

  const handleTabChange = useCallback((value: string) => {
    if (!isControlled) {
      setActiveTab(value)
    }
    onChange?.(value)
  }, [isControlled, onChange])

  const value = useMemo(() => ({
    activeTab: isControlled ? String(propValue) : activeTab,
    onTabChange: handleTabChange,
  }), [isControlled, propValue, activeTab, handleTabChange])

  return (
    <TabsContext.Provider value={value}>
      <View {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  )
}

function TabList({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <View className="flex items-center justify-around px">
      {children}
    </View>
  )
}

function TabTrigger({
  value,
  asChild = false,
  children,
  ...props
}: Readonly<{
  value: string
  asChild?: boolean
} & ComponentProps<typeof View>>) {
  const context = useContext(TabsContext)
  if (!context)
    throw new Error("TabTrigger must be used within a Tabs component")

  const { activeTab, onTabChange } = context
  const isActive = activeTab === value

  return asChild
    ? (
        <Slot
          onClick={() => onTabChange(value)}
          className={cn(
            "flex flex-col center py-xs font-xl gap-xs",
            { "text-primary": isActive },
          )}
        >
          {children}
        </Slot>
      )
    : (
        <View
          className={cn(
            "flex flex-col center py-xs font-xl gap-xs",
            { "text-primary": isActive },
          )}
          onClick={() => onTabChange(value)}
          {...props}
        >
          {children}
          <View
            className={cn(
              isActive ? "bg-primary" : "bg-transparent",
            )}
            style={{
              width: "1.5em",
              height: "2px",
            }}
          />
        </View>
      )
}

function TabContent({
  children,
  ...props
}: Readonly<ComponentProps<typeof View>>) {
  return (
    <View {...props}>
      {children}
    </View>
  )
}

function TabItem({
  value,
  children,
  ...props
}: Readonly<{
  value: string
} & ComponentProps<typeof View>>) {
  const context = useContext(TabsContext)
  if (!context)
    throw new Error("TabItem must be used within a Tabs component")

  const { activeTab } = context
  const isActive = activeTab === value

  return isActive
    ? (
        <View {...props}>
          {children}
        </View>
      )
    : <></>
}

export { TabContent, TabItem, TabList, Tabs, TabTrigger }
