import type { RankRequest, RankResponse } from "@/apis/models/rank"
import type { XN, XQ } from "@/types/semester"
import { Picker, View } from "@tarojs/components"
import { hideLoading, showLoading, showToast } from "@tarojs/taro"
import { useCallback, useMemo, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Option, Options } from "@/components/options"
import { PageContent } from "@/components/page"
import { useAuth } from "@/hooks/auth"
import { useSemester } from "@/hooks/semester"
import ToIcon from "@/static/common/to.svg"
import EmptyIcon from "@/static/tools/grade/ranking/empty.svg"
import { RankContent } from "@/tools/pages/grade/ranking/components/rank-content"
import { SwitchButton } from "@/tools/pages/grade/ranking/components/switch-button"

interface Data {
  request: RankRequest
  response: RankResponse
}

const DATA_SOURCE_OPTIONS = [
  { label: "成绩主库", value: "total" },
  { label: "执行方案", value: "execution" },
] as const

const RANGE_OPTIONS = [
  { label: "主修", value: "major" },
  { label: "辅修", value: "minor" },
] as const

const DISPLAY_OPTIONS = [
  { label: "最大成绩", value: "max" },
  { label: "初修成绩", value: "initial" },
] as const

/**
 * @description 学期筛选项, label 供 Picker 展示, value 为业务值
 */
const XQ_OPTIONS = [
  { label: "全部学期", value: undefined },
  { label: "秋季学期", value: "autumn" },
  { label: "春季学期", value: "spring" },
  { label: "夏季学期", value: "summer" },
] as const satisfies ReadonlyArray<{
  label: string
  value: Extract<XQ, "autumn" | "spring" | "summer"> | undefined
}>

/**
 * @description 根据学年获取学年名称
 */
function getXNName(xn: XN): string {
  return `${xn}-${xn + 1} 学年`
}

/**
 * @description 根据学期标识符获取学期名称
 */
function getXQName(xq: XQ): string {
  switch (xq) {
    case "autumn": return "秋季学期"
    case "spring": return "春季学期"
    case "summer": return "夏季学期"
    default: return "未知学期"
  }
}

function PickerValue({
  value,
}: Readonly<{
  value: string
}>) {
  return (
    <View className="flex items-center gap-xs">
      <View className="ellipsis">{value}</View>
      <Icon
        className="size-s-lg"
        src={ToIcon}
      />
    </View>
  )
}

export function HDJW() {
  const { user, isLoading: isUserLoading } = useAuth()
  const { data: semester, isLoading: isSemesterLoading } = useSemester()

  // 请求表单数据
  const [form, setForm] = useState<RankRequest>({
    range: "major",
    data_source: "total",
    display: "max",
  })

  // 展示数据
  const [data, setData] = useState<Data | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  // 选择值
  const [picker, setPicker] = useState([0, 0])

  const isBootstrapLoading = isUserLoading || isSemesterLoading
  const isBootstrapReady = Boolean(user && semester)

  // 学年选项: 全部学年 + 入学年到当前学年
  const xnOptions = useMemo(() => {
    if (!user || !semester)
      return []

    return [
      { label: "全部学年", value: undefined as number | undefined },
      ...Array.from({ length: semester.xn - user.enter + 1 }).map((_, i) => {
        const xn = semester.xn - i
        return { label: getXNName(xn), value: xn }
      }),
    ]
  }, [semester, user])

  // 学期选项: 全部学年时仅「全部学期」, 否则含具体学期
  const xqOptions = useMemo(
    () => (picker[0] === 0 ? XQ_OPTIONS.slice(0, 1) : [...XQ_OPTIONS]),
    [picker],
  )

  const pickerRange = useMemo(
    () => [xnOptions.map(item => item.label), xqOptions.map(item => item.label)],
    [xnOptions, xqOptions],
  )

  // 应用 picker 变化
  const handlePickerChange = () => {
    setForm(p => ({
      ...p,
      xn: xnOptions[picker[0]]?.value,
      xq: xqOptions[picker[1]]?.value,
    }))
  }

  // 请求 Promise
  const fetchRank = useCallback(async (request: RankRequest) => {
    setIsLoading(true)

    return api.rank.get(request)
      .then((res) => {
        setData({
          request,
          response: res.data,
        })
        hideLoading()
      })
      .catch((err) => {
        switch (err.code) {
          case "NOT_SUPPORTED":
            void showToast({
              title: "暂不支持研究生",
              icon: "error",
            })
            break
          default:
            void showToast({
              title: "排名查询失败",
              icon: "error",
            })
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  // 查询
  const handleSubmit = () => {
    if (isLoading)
      return

    void showLoading({
      title: "加载中...",
    })
    void fetchRank(form)
  }

  return (
    <PageContent
      isLoading={isBootstrapLoading}
      onRefresh={data ? () => fetchRank(data.request) : null}
      className="h-full"
    >
      {!isBootstrapReady
        ? (
            <View className="h-full flex flex-col center gap">
              <Icon className="size-l-lg" src={EmptyIcon} />
              <View>信息加载失败</View>
            </View>
          )
        : (
            <View className="flex flex-col p gap-xl">
              <Card>
                <CardContent className="flex flex-col gap-sm">
                  <View className="bold text-lg">筛选</View>
                  <Options>
                    <Option
                      size="sm"
                      className="px-xs"
                      title={<View className="text-muted">数据来源</View>}
                      content={(
                        <View className="flex items-center gap-xs">
                          {DATA_SOURCE_OPTIONS.map(item => (
                            <SwitchButton
                              key={item.value}
                              active={form.data_source === item.value}
                              onClick={() => setForm(p => ({
                                ...p,
                                data_source: item.value,
                              }))}
                            >
                              {item.label}
                            </SwitchButton>
                          ))}
                        </View>
                      )}
                    />

                    <Option
                      size="sm"
                      className="px-xs"
                      title={<View className="text-muted">课程范围</View>}
                      content={(
                        <View className="flex items-center gap-xs">
                          {RANGE_OPTIONS.map(item => (
                            <SwitchButton
                              key={item.value}
                              active={form.range === item.value}
                              onClick={() => setForm(p => ({
                                ...p,
                                range: item.value,
                              }))}
                            >
                              {item.label}
                            </SwitchButton>
                          ))}
                        </View>
                      )}
                    />

                    <Option
                      size="sm"
                      className="px-xs"
                      title={<View className="text-muted">显示方式</View>}
                      content={(
                        <View className="flex items-center gap-xs">
                          {DISPLAY_OPTIONS.map(item => (
                            <SwitchButton
                              key={item.value}
                              active={form.display === item.value}
                              onClick={() => setForm(p => ({
                                ...p,
                                display: item.value,
                              }))}
                            >
                              {item.label}
                            </SwitchButton>
                          ))}
                        </View>
                      )}
                    />

                    <Picker
                      mode="multiSelector"
                      range={pickerRange}
                      value={picker}
                      onColumnChange={(e) => {
                        const newPicker = [...picker]
                        newPicker[e.detail.column] = e.detail.value
                        // 切回「全部学年」时强制学期列为全部学期
                        if (e.detail.column === 0 && e.detail.value === 0)
                          newPicker[1] = 0
                        setPicker(newPicker)
                      }}
                      onChange={() => handlePickerChange()}
                    >
                      <Option
                        size="xl"
                        className="px-xs"
                        title={<View className="text-muted">时间范围</View>}
                        content={(
                          <PickerValue
                            value={`${xnOptions[picker[0]]?.label ?? ""} ${xqOptions[picker[1]]?.label ?? ""}`}
                          />
                        )}
                      />
                    </Picker>
                  </Options>

                  <MyButton
                    active
                    className="py flex center rounded-sm"
                    onClick={() => handleSubmit()}
                  >
                    查询
                  </MyButton>

                  <View className="flex center text-primary">
                    成绩仅供参考,
                    {" "}
                    请以教务系统成绩为准!
                  </View>
                </CardContent>
              </Card>

              {data && (
                <View className="flex flex-col gap">
                  <View className="flex flex-col gap-xs px">
                    <View className="text-2xl text-bold text-primary">
                      {data.request.xn ? getXNName(data.request.xn) : "全部学年"}
                      {" "}
                      {data.request.xq ? getXQName(data.request.xq) : "全部学期"}
                    </View>
                    <View className="text-toned">
                      {data.request.data_source === "total" ? "成绩主库" : "执行方案"}
                      {" · "}
                      {data.request.range === "major" ? "主修" : "辅修"}
                      {" · "}
                      {data.request.display === "max" ? "最大成绩" : "初修成绩"}
                    </View>
                  </View>

                  <RankContent data={data.response} />
                </View>
              )}
            </View>
          )}
    </PageContent>
  )
}
