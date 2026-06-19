import type { EyeGrade } from "@/apis/models/gym"
import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"

export function Eye({
  data,
  onClose,
}: Readonly<{
  data: EyeGrade
  onClose: () => void
}>) {
  const options: OptionItem[] = [
    { title: "左裸眼视力", content: `${data.sight.left.value ?? "--"} ${data.sight.left.description}` },
    { title: "右裸眼视力", content: `${data.sight.right.value ?? "--"} ${data.sight.right.description}` },
    { title: "左眼串镜", content: `${data.mirror.left.value ?? "--"} ${data.mirror.left.description}` },
    { title: "右眼串镜", content: `${data.mirror.right.value ?? "--"} ${data.mirror.right.description}` },
    { title: "左眼屈光不正", content: `${data.ametropia.left.value ?? "--"} ${data.ametropia.left.description}` },
    { title: "右眼屈光不正", content: `${data.ametropia.right.value ?? "--"} ${data.ametropia.right.description}` },
  ]

  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="视力详情"
    >
      <View className="p flex flex-col gap">
        <Options items={options} />
      </View>
    </Popup>
  )
}
