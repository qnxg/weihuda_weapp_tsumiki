import type { BaseEventOrig } from "@tarojs/components"
import type { CSSProperties } from "react"
import type { CardSortItem } from "../hooks/useCardSort"
import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useRef, useState } from "react"
import { Icon } from "@/components/icon"
import ToIcon from "@/static/common/to.svg"
import { cn } from "@/utils/cn"

// 触摸点数据
interface TouchPoint {
  clientX: number
  clientY: number
}

// 拖拽触摸事件 (扩展出 touches)
interface DragTouchEvent extends BaseEventOrig<object> {
  touches: TouchPoint[]
}

// 每行固定高度 (rpx), 对应 h-md 原子类 (120rpx)
const ITEM_HEIGHT_RPX = 120
// rpx 转 px 换算比率 (750 设计稿)
const RPX_RATIO = Taro.getSystemInfoSync().windowWidth / 750
// 实际像素行高
const ITEM_HEIGHT_PX = ITEM_HEIGHT_RPX * RPX_RATIO

/**
 * @description 可拖拽排序的卡片列表
 *   - 禁用的卡片不可拖拽, 且启用卡片不可拖入禁用区
 *   - 拖拽中: 当前行跟手移动, 其余行自动让位
 *   - 松手后回调 onMove 完成排序
 * @property {CardSortItem[]} items - 排序列表数据
 * @property {(from: number, to: number) => void} onMove - 拖拽移动回调
 * @property {(index: number) => void} onToggle - 切换启用 / 禁用回调
 */
export interface SortableListProps {
  items: CardSortItem[] // 排序列表数据
  onMove: (from: number, to: number) => void // 拖拽移动回调
  onToggle: (index: number) => void // 切换启用 / 禁用回调
}

/**
 * @description 可拖拽排序的卡片列表组件
 * 拖拽手柄上 touchstart 发起拖拽, catchMove 阻止 touchmove 冒泡 (避免页面滚动),
 * onTouchMove 计算跟手偏移与目标位置, 松手后回调 onMove 完成排序
 */
export function SortableList({
  items,
  onMove,
  onToggle,
}: Readonly<SortableListProps>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)

  const startYRef = useRef(0)

  // 最后一个启用卡片的索引, 拖拽范围不会越过它 (禁用区不可插入)
  const lastEnabledIndex = items.findLastIndex(i => i.enabled)

  const handleTouchStart = useCallback((index: number, e: DragTouchEvent) => {
    // 禁用的卡片不可拖拽
    if (!items[index]?.enabled) {
      return
    }
    const touch = e.touches[0]
    setDragIndex(index)
    setTargetIndex(index)
    setDragOffset(0)
    startYRef.current = touch.clientY
  }, [items])

  const handleTouchMove = useCallback((e: DragTouchEvent) => {
    if (dragIndex === null) {
      return
    }
    const touch = e.touches[0]
    const offset = touch.clientY - startYRef.current
    const delta = Math.round(offset / ITEM_HEIGHT_PX)
    const newTarget = Math.max(0, Math.min(lastEnabledIndex, dragIndex + delta))

    setDragOffset(offset)
    setTargetIndex(newTarget)
  }, [dragIndex, lastEnabledIndex])

  const handleTouchEnd = useCallback(() => {
    if (dragIndex === null || targetIndex === null) {
      return
    }
    if (targetIndex !== dragIndex) {
      onMove(dragIndex, targetIndex)
    }

    setDragIndex(null)
    setTargetIndex(null)
    setDragOffset(0)
  }, [dragIndex, targetIndex, onMove])

  // 计算每行的位移样式
  const getItemStyle = useCallback((index: number): CSSProperties => {
    if (dragIndex === null || targetIndex === null) {
      return {}
    }

    // 正在被拖拽的项: 跟手移动 + 视觉提升
    if (index === dragIndex) {
      return {
        transform: `translateY(${dragOffset}px)`,
        zIndex: 10,
        boxShadow: "0 8rpx 24rpx rgba(0, 0, 0, 0.12)",
        opacity: 0.92,
        transition: "none",
      }
    }

    // 目标位置在下方: 拖拽项和 target 之间的项向上移
    if (targetIndex > dragIndex && index > dragIndex && index <= targetIndex) {
      return {
        transform: `translateY(-${ITEM_HEIGHT_PX}px)`,
        transition: "transform 0.2s ease",
      }
    }

    // 目标位置在上方: target 和拖拽项之间的项向下移
    if (targetIndex < dragIndex && index >= targetIndex && index < dragIndex) {
      return {
        transform: `translateY(${ITEM_HEIGHT_PX}px)`,
        transition: "transform 0.2s ease",
      }
    }

    return {}
  }, [dragIndex, targetIndex, dragOffset])

  let enabledSeq = 0

  return (
    <View className="flex flex-col">
      {items.map((item, index) => {
        const displayIndex = item.enabled ? ++enabledSeq : null

        return (
          <View
            key={item.key}
            className="flex items-center gap px h-md border-b border-muted"
            style={{
              position: "relative",
              ...getItemStyle(index),
            }}
          >
            {/* 序号 */}
            <View
              className="flex items-center justify-center size-md"
              style={{ minWidth: "60rpx" }}
            >
              <View
                className={cn(
                  "text-md",
                  item.enabled ? "text-toned" : "text-muted",
                )}
              >
                {displayIndex ?? "—"}
              </View>
            </View>

            {/* 启用 / 禁用切换 */}
            <View
              className="flex items-center justify-center px-sm"
              onClick={() => onToggle(index)}
            >
              <View
                className={cn(
                  "rounded-full size-sm",
                  { "bg-primary": item.enabled },
                )}
                style={{
                  backgroundColor: item.enabled
                    ? undefined
                    : "var(--bg-color-page)",
                  border: item.enabled
                    ? "none"
                    : "4rpx solid var(--text-color-toned)",
                  transition: "background-color 0.15s, border-color 0.15s",
                }}
              />
            </View>

            {/* 卡片名称 */}
            <View
              className={cn(
                "flex-1 text-md",
                item.enabled ? "text-base" : "text-toned",
              )}
              onClick={() => onToggle(index)}
            >
              {item.name}
            </View>

            {/* 拖拽手柄 */}
            <View
              className="flex items-center justify-center px-sm"
              style={{ touchAction: "none" }}
              catchMove
              onTouchStart={e => handleTouchStart(index, e as unknown as DragTouchEvent)}
              onTouchMove={e => handleTouchMove(e as unknown as DragTouchEvent)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <Icon src={ToIcon} className="size-md text-toned" />
            </View>
          </View>
        )
      })}
    </View>
  )
}
