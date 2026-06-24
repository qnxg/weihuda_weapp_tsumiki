import type { CardHistoryItem } from "@/apis/models/card"
import type { OptionItem } from "@/components/options"
import { View } from "@tarojs/components"
import { Options } from "@/components/options"
import { Popup } from "@/components/overlay"
import dayjs from "@/utils/dayjs"

export function Detail({
  record,
  onClose,
}: Readonly<{
  record: CardHistoryItem
  onClose: () => void
}>) {
  const options: OptionItem[] = [
    { title: "交易时间", content: dayjs(record.date_time).format("YYYY-MM-DD HH:mm:ss") },
    { title: "记账时间", content: dayjs(record.journal_time).format("YYYY-MM-DD HH:mm:ss") },
    { title: "交易名称", content: record.name },
    { title: "交易地点", content: record.location },
    { title: "交易金额", content: `${record.amount > 0 ? "+" : ""}${record.amount.toFixed(2)}` },
    { title: "交易后余额", content: record.now_balance.toFixed(2) },
    { title: "交易状态", content: record.status },
  ]

  return (
    <Popup
      isLoading={false}
      onClose={onClose}
      title="交易详情"
    >
      <View className="p flex flex-col gap">
        <Options items={options} />
      </View>
    </Popup>
  )
}
