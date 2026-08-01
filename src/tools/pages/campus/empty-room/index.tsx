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
import ToIcon from "@/static/common/to.svg"
import EmptyIcon from "@/static/tools/campus/empty-room/empty.svg"
import {
  BUILDINGS,
  formatMajorPeriodLabel,
  formatMajorPeriods,
  getDefaultMajorPeriods,
  MAJOR_PERIODS,
} from "@/tools/pages/campus/empty-room/config"
import { od } from "@/utils/ohday"

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
        <View className="flex flex-col p gap">
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
                          label={period.label}
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
            <View
              className="flex flex-col gap"
              style={{
                marginTop: "20px",
              }}
            >
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
                    <View className="rounded-sm overflow-hidden bg">
                      <View
                        className="flex flex-col center gap"
                        style={{
                          paddingTop: "80px",
                          paddingBottom: "80px",
                        }}
                      >
                        <Icon className="size-xl" src={EmptyIcon} />
                        <View className="text-toned">该条件下暂无空教室</View>
                      </View>
                    </View>
                  )}
            </View>
          )}
        </View>
      </PageContent>
    </Page>
  )
}
