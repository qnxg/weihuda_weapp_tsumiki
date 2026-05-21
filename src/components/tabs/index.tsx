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

/**
 * @description Tab 选择组件容器
 * @example
 * ```tsx
 * <Tabs>
 *   <TabList>
 *     <TabTrigger value="tab1">Tab 1</TabTrigger>
 *     <TabTrigger value="tab2">Tab 2</TabTrigger>
 *   </TabList>
 *   <TabContent>
 *     <TabItem value="tab1">Tab 1 内容</TabItem>
 *     <TabItem value="tab2">Tab 2 内容</TabItem>
 *   </TabContent>
 * </Tabs>
 * ```
 * 1. 基础用法: 可当作 View 编写样式
 * 2. 受控用法: 通过 value 和 onChange 控制当前选中项
 * ```tsx
 * <Tabs
 *   value={activeTab}
 *   onChange={(value) => setActiveTab(value)}
 * >
 *   内容
 * </Tabs/
 * ```
 * 3. 非受控用法: 通过 defaultValue 设置默认选中项, 内部维护选中状态
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   内容
 * </Tabs>
 * ```
 */
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

/**
 * @description Tab 选择按钮容器, 用于承载 TabTrigger 组件
 * @example
 * ```tsx
 * <Tabs>
 *   <TabList>
 *     <TabTrigger value="tab1">Tab 1</TabTrigger>
 *     <TabTrigger value="tab2">Tab 2</TabTrigger>
 *   </TabList>
 *   内容
 * </Tabs>
 * ```
 */
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

/**
 * @description Tab 选择按钮
 * @example
 * 1. 默认用法
 * ```tsx
 * <TabTrigger value="tab1">Tab 1</TabTrigger>
 * ```
 * 2. asChild 用法: 可自定义选择按钮样式, 需要保证子组件可接受 onClick 和 className
 * ```tsx
 * <TabTrigger value="tab1" asChild>
 *   <MyButton>Tab 1</MyButton>
 * </TabTrigger>
 * ```
 */
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

/**
 * @description Tab 内容容器
 * @example
 * 当成 View 即可
 */
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

/**
 * @description Tab 内容项
 * @example
 * ```tsx
 * <TabContent>
 *   <TabItem value="tab1">
 *     Tab 1 内容
 *   </TabItem>
 *   <TabItem value="tab2">
 *     Tab 2 内容
 *   </TabItem>
 * </TabContent>
 * ```
 */
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
