import { ScrollView, View } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import { api } from "@/apis"
import { Icon } from "@/components/icon"
import { Options } from "@/components/options"
import { Overlay, OverlayMask } from "@/components/overlay"
import { useRequest } from "@/hooks/request"
import CloseIcon from "@/static/tools/grade/grade/close.svg"

export function Detail({
  jx0404id,
  onClose,
}: Readonly<{
  jx0404id: string
  onClose: () => void
}>) {
  const { data, isLoading } = useRequest(() => api.grade.getDetail(jx0404id))

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)

    setTimeout(() => {
      onClose()
    }, 200)
  }

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const list = useMemo(() => {
    if (!data)
      return []

    const KEY_ORDER = ["平时", "期中", "期末"] as const

    return data.toSorted((a, b) => {
      const getWeight = (name: string) => {
        const idx = KEY_ORDER.findIndex(key => name.includes(key))
        return idx === -1 ? 0 : idx + 1
      }

      const weightA = getWeight(a.name)
      const weightB = getWeight(b.name)

      if (weightA !== weightB)
        return weightA - weightB

      return a.name.localeCompare(b.name)
    })
  }, [data])

  return (
    <Overlay>
      <OverlayMask
        position="bottom"
        isLoading={isLoading}
        onClick={() => handleClose()}
      >
        <View
          className="bg flex flex-col p gap"
          style={{
            maxHeight: "80vh",
            transform: isOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.2s ease",
          }}
          onClick={e => e.stopPropagation()}
        >
          <View className="flex items-center justify-between p text-2xl text-bold">
            <View>分数详情</View>
            <View onClick={() => handleClose()}>
              <Icon
                style={{
                  width: "32rpx",
                  height: "32rpx",
                }}
                src={CloseIcon}
              />
            </View>
          </View>

          <ScrollView
            className="h-full"
            scrollY
            enhanced
            showScrollbar={false}
          >
            <View className="p flex flex-col gap">
              <Options>
                {list.map((item, index) => (
                  <View
                    key={`${item.name}-${index}`}
                    className="py flex items-center justify-between bg"
                  >
                    <View className="flex flex-col gap">
                      <View className="text-lg">{item.name}</View>
                      <View className="text-sm text-toned">{item.percentage}</View>
                    </View>
                    <View className="text-xl">{item.score}</View>
                  </View>
                ))}
              </Options>
            </View>
          </ScrollView>
        </View>
      </OverlayMask>
    </Overlay>
  )
}
