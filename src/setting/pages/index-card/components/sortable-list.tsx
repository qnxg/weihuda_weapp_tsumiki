import type { BaseEventOrig } from "@tarojs/components"
import type { CSSProperties } from "react"
import type { CardSortItem } from "../hooks/useCardSort"
import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useRef, useState } from "react"
import { Icon } from "@/components/icon"
import { Option, Options } from "@/components/options"
import GridDotsIcon from "@/static/setting/index-card/grid-dots.svg"
import { cn } from "@/utils/cn"

interface TouchPoint {
  clientX: number
  clientY: number
}

interface DragTouchEvent extends BaseEventOrig<object> {
  touches: TouchPoint[]
}

const ITEM_HEIGHT_RPX = 75
const RPX_RATIO = Taro.getSystemInfoSync().windowWidth / 750
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
  items: CardSortItem[]
  onMove: (from: number, to: number) => void
  onToggle: (index: number) => void
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
  const lastEnabledIndex = items.findLastIndex(i => i.enabled)

  const handleTouchStart = useCallback((index: number, e: DragTouchEvent) => {
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

  const getItemStyle = useCallback((index: number): CSSProperties => {
    if (dragIndex === null || targetIndex === null) {
      return {}
    }

    if (index === dragIndex) {
      return {
        transform: `translateY(${dragOffset}px)`,
        zIndex: 10,
        boxShadow: "0 8rpx 24rpx rgba(0, 0, 0, 0.12)",
        opacity: 0.92,
        transition: "none",
      }
    }

    if (targetIndex > dragIndex && index > dragIndex && index <= targetIndex) {
      return {
        transform: `translateY(-${ITEM_HEIGHT_PX}px)`,
        transition: "transform 0.2s ease",
      }
    }

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
    <Options>
      {items.map((item, index) => {
        const displayIndex = item.enabled ? ++enabledSeq : null

        return (
          <Option
            key={item.key}
            size="md"
            title={(
              <View className="flex items-center gap-sm">
                {/* 左侧圆形按钮: 内含序号, 大小与 Option size="md" 图标一致 */}
                <View
                  className={cn(
                    "flex items-center justify-center rounded-full",
                    item.enabled ? "bg-primary text-reverse border-primary" : "bg-transparent text-base border-base",
                  )}
                  style={{
                    width: "40rpx",
                    height: "40rpx",
                    transition: "background-color 0.15s, border-color 0.15s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation?.()
                    onToggle(index)
                  }}
                >
                  <View className="text-sm">
                    {displayIndex ?? "—"}
                  </View>
                </View>
                <View>
                  {item.name}
                </View>
              </View>
            )}
            content={(
              <View
                className="flex items-center justify-center"
                style={{ touchAction: "none" }}
                catchMove
                onTouchStart={e => handleTouchStart(index, e as unknown as DragTouchEvent)}
                onTouchMove={e => handleTouchMove(e as unknown as DragTouchEvent)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                {item.enabled && (
                  <Icon
                    src={GridDotsIcon}
                    style={{
                      width: "40rpx",
                      height: "40rpx",
                    }}
                  />
                )}
              </View>
            )}
            onClick={() => onToggle(index)}
            style={getItemStyle(index)}
          />
        )
      })}
    </Options>
  )
}
