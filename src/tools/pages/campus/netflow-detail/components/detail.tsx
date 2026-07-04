import type { NetflowDetailItem } from "@/apis/models/netflow"
import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"
import { parseNetflowItemName } from "@/tools/pages/campus/netflow-detail/utils/detail"

export function Detail({
  item,
  onClose,
}: Readonly<{
  item: NetflowDetailItem
  onClose: () => void
}>) {
  const { title, content } = parseNetflowItemName(item.app)

  const options: OptionItem[] = [
    { title: "应用分类", content: title },
    { title: "应用名称", content },
    { title: "总用量", content: item.total },
    { title: "下载用量", content: item.download },
    { title: "上传用量", content: item.upload },
    { title: "占比", content: item.percentage },
  ]

  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="流量详情"
    >
      <View className="p flex flex-col gap">
        <Options items={options} />
      </View>
    </Popup>
  )
}
