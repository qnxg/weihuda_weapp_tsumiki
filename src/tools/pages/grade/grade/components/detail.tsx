import { View } from "@tarojs/components"
import { useMemo } from "react"
import { api } from "@/apis"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"
import { useRequest } from "@/hooks/request"

export function Detail({
  jx0404id,
  onClose,
}: Readonly<{
  jx0404id: string
  onClose: () => void
}>) {
  const { data, isLoading } = useRequest(() => api.grade.getDetail(jx0404id))

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
    <Popup
      isLoading={isLoading}
      onClose={onClose}
      title="分数详情"
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
    </Popup>
  )
}
