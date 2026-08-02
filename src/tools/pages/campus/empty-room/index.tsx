import type { EmptyRoomItem, EmptyRoomRequest } from "@/apis/models/empty-room"
import { Picker, View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { useCallback, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Checkbox } from "@/components/checkbox"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Option, Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { BUILDINGS } from "@/config/buildings"
import {
  MAJOR_PERIODS,
} from "@/config/schedule"
import ToIcon from "@/static/common/to.svg"
import EmptyIcon from "@/static/tools/campus/empty-room/empty.svg"
import { od } from "@/utils/ohday"

/**
 * @description 根据当前时间预选大节次
 * - 优先选中正在进行的大节
 * - 否则选中尚未开始且离当前时间最近的大节
 * - 若已晚于最后一节结束时间, 则不预选
 */
function getDefaultMajorPeriods(now = od()): number[] {
  const at = (time: string) => od(time, "HH:mm")

  // 尚未结束的大节次 (正在进行或尚未开始)
  const candidates = MAJOR_PERIODS.filter(period => now.le(at(period.end), "m"))
  if (candidates.length === 0)
    return []

  const ongoing = candidates.find((period) => {
    const start = at(period.start)
    const end = at(period.end)
    return now.bt(start, end.add("ms", 1))
  })
  if (ongoing)
    return [ongoing.index]

  // 选尚未开始且开始时间离现在最近的一节
  const upcoming = candidates.reduce((nearest, period) => {
    const nearestDiff = at(nearest.start).diff(now, "m")
    const periodDiff = at(period.start).diff(now, "m")
    return periodDiff < nearestDiff ? period : nearest
  })

  return [upcoming.index]
}

/**
 * @description 将大节次序号列表格式化为接口 time 参数
 */
function formatMajorPeriods(periods: number[]): string {
  return [...periods].sort((a, b) => a - b).join(",")
}

/**
 * @description 将大节次序号列表格式化为展示文案, 如 "第 1 / 2 大节"
 */
function formatMajorPeriodLabel(periods: number[]): string {
  const sorted = [...periods].sort((a, b) => a - b)
  if (sorted.length === 0)
    return ""
  if (sorted.length === 1)
    return `第 ${sorted[0]} 大节`
  return `第 ${sorted.join(" / ")} 大节`
}

interface QueryResult {
  request: EmptyRoomRequest
  rooms: EmptyRoomItem[]
  buildingName: string
  periodLabel: string
}

const BUILDING_NAMES = BUILDINGS.map(building => building.name)

function PickerValue({
  value,
}: Readonly<{
  value: string
}>) {
  return (
    <View className="flex items-center gap-xs">
      <View className="ellipsis">{value}</View>
      <Icon
        src={ToIcon}
        style={{
          width: "28rpx",
          height: "28rpx",
        }}
      />
    </View>
  )
}

export default function EmptyRoom() {
  const [date, setDate] = useState(() => od().cs("d").s)
  const [buildingIndex, setBuildingIndex] = useState(0)
  const [periods, setPeriods] = useState<number[]>(() => getDefaultMajorPeriods())
  const [result, setResult] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const dateDisplay = od(date).p("YYYY-MM-DD")
  const building = BUILDINGS[buildingIndex]

  const togglePeriod = (index: number) => {
    setPeriods((prev) => {
      if (prev.includes(index))
        return prev.filter(item => item !== index)
      return [...prev, index].sort((a, b) => a - b)
    })
  }

  const fetchRooms = useCallback(async (request: EmptyRoomRequest, buildingName: string, periodLabel: string) => {
    setIsLoading(true)

    return api.emptyRoom.get(request)
      .then((res) => {
        setResult({
          request,
          rooms: res.data,
          buildingName,
          periodLabel,
        })
        hideLoading()
      })
      .catch(() => {
        hideLoading()
        void showToast({
          title: "空教室查询失败",
          icon: "error",
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = () => {
    if (isLoading)
      return

    if (periods.length === 0) {
      void showToast({
        title: "请选择上课节次",
        icon: "none",
      })
      return
    }

    const request: EmptyRoomRequest = {
      building_id: building.id,
      time: formatMajorPeriods(periods),
      date: dateDisplay,
    }

    void showLoading({
      title: "加载中...",
    })
    void fetchRooms(request, building.name, formatMajorPeriodLabel(periods))
  }

  return (
    <Page>
      <PageContent
        className="h-full"
        onRefresh={result
          ? () => fetchRooms(result.request, result.buildingName, result.periodLabel)
          : null}
      >
        <View className="flex flex-col p gap-xl">
          <Card>
            <CardContent className="flex flex-col gap-sm">
              <View className="bold text-lg">筛选</View>
              <Options>
                <Picker
                  mode="date"
                  value={dateDisplay}
                  onChange={(e) => {
                    setDate(od(e.detail.value).cs("d").s)
                  }}
                >
                  <Option
                    size="xl"
                    className="px-xs"
                    title={<View className="text-muted">日期</View>}
                    content={<PickerValue value={dateDisplay} />}
                  />
                </Picker>

                <Picker
                  mode="selector"
                  range={BUILDING_NAMES}
                  value={buildingIndex}
                  onChange={(e) => {
                    setBuildingIndex(Number(e.detail.value))
                  }}
                >
                  <Option
                    size="xl"
                    className="px-xs"
                    title={<View className="text-muted">楼栋</View>}
                    content={<PickerValue value={building.name} />}
                  />
                </Picker>

                <Option
                  size="xl"
                  layout="vertical"
                  className="px-xs"
                  title={<View className="text-muted">节次</View>}
                  content={(
                    <View className="flex flex-col gap px">
                      {MAJOR_PERIODS.map(period => (
                        <Checkbox
                          key={period.index}
                          checked={periods.includes(period.index)}
                          label={`第 ${period.index} 大节`}
                          description={`${period.start} - ${period.end}`}
                          onClick={() => togglePeriod(period.index)}
                        />
                      ))}
                    </View>
                  )}
                />
              </Options>

              <MyButton
                active
                className="py flex center rounded-sm"
                onClick={() => handleSubmit()}
              >
                查询
              </MyButton>
            </CardContent>
          </Card>

          {result && (
            <View className="flex flex-col gap">
              <View className="flex flex-col gap-xs px">
                <View className="text-2xl text-bold text-primary">{result.buildingName}</View>
                <View className="text-sm text-muted">
                  {od(result.request.date).p("YYYY-MM-DD")}
                  {" · "}
                  {result.periodLabel}
                </View>
                <View className="text-toned">
                  共
                  {" "}
                  {result.rooms.length}
                  {" "}
                  间空教室
                </View>
              </View>

              {result.rooms.length > 0
                ? (
                    <View className="rounded-sm overflow-hidden">
                      <Options>
                        {result.rooms.map(room => (
                          <Option
                            key={`${room.room_name}-${room.room_type}`}
                            size="xl"
                            className="px"
                            title={(
                              <View className="flex flex-col gap-xs">
                                <View className="text-bold">{room.room_name}</View>
                                <View className="text-muted">{room.room_type}</View>
                              </View>
                            )}
                            content={(
                              <View className="text-toned">
                                {room.seat_count}
                                人
                              </View>
                            )}
                          />
                        ))}
                      </Options>
                    </View>
                  )
                : (
                    <View
                      className="rounded-sm overflow-hidden bg flex flex-col center gap"
                      style={{ height: "380rpx" }}
                    >
                      <Icon className="size-xl" src={EmptyIcon} />
                      <View className="text-toned">该条件下暂无空教室</View>
                    </View>
                  )}
            </View>
          )}
        </View>
      </PageContent>
    </Page>
  )
}
