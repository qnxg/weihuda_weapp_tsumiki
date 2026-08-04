import type { EyeGrade, EyeGradeDetail } from "@/apis/models/gym"
import { View } from "@tarojs/components"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"

/**
 * @description 格式化单眼视力展示文案
 */
function formatEyeSide(side: EyeGradeDetail["left"]) {
  return `${side.value ?? "--"} (${side.description})`
}

/**
 * @description 视力分组区块
 */
function EyeSection({
  title,
  detail,
}: Readonly<{
  title: string
  detail: EyeGradeDetail
}>) {
  return (
    <View className="flex flex-col gap-sm">
      <View className="text-bold">{title}</View>
      <Options
        items={[
          { title: "左眼", content: formatEyeSide(detail.left) },
          { title: "右眼", content: formatEyeSide(detail.right) },
        ]}
      />
    </View>
  )
}

export function Eye({
  data,
  onClose,
}: Readonly<{
  data: EyeGrade
  onClose: () => void
}>) {
  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="视力详情"
    >
      <View className="p flex flex-col gap">
        <EyeSection title="裸眼视力" detail={data.sight} />
        <EyeSection title="串镜" detail={data.mirror} />
        <EyeSection title="屈光不正" detail={data.ametropia} />
      </View>
    </Popup>
  )
}
