import type { RankRequest, RankResponse } from "@/apis/models/rank"
import { Picker, View } from "@tarojs/components"
import { hideToast, showToast } from "@tarojs/taro"
import { useCallback, useMemo, useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { PageContent } from "@/components/page"
import { useSemester } from "@/hooks/semester"
import { useUser } from "@/hooks/user"
import EmptyIcon from "@/static/tools/grade/ranking/empty.svg"
import { HDJWSwitchButton } from "@/tools/pages/grade/ranking/components/hdjw-switch-button"
import { RankContent } from "@/tools/pages/grade/ranking/components/rank-content"
import { getXNFromName, getXNName, getXQFromName, getXQName } from "@/tools/pages/grade/ranking/utils/xn-xq"

interface Data {
  request: RankRequest
  response: RankResponse
}

export function HDJW() {
  const { user } = useUser()
  const { data: semester } = useSemester()

  // 请求表单数据
  const [form, setForm] = useState<RankRequest>({
    range: "major",
    data_source: "total",
    display: "max",
  })

  // 展示数据
  const [data, setData] = useState<Data | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  // 根据当前学期和用户信息生成学年选择范围, 最多包含 20 个学年(防止死循环)
  const getPickerXNRange = () => {
    if (!semester)
      return ["学期信息缺失"]

    if (!user)
      return ["用户信息缺失"]

    return [
      "全部学年",
      ...Array.from({ length: semester.xn - user.enter + 1 }).map((_, i) => getXNName(semester.xn - i)),
    ]
  }

  // 选择值
  const [picker, setPicker] = useState([0, 0])

  // 学年选择范围
  const pickerXNRange: string[] = getPickerXNRange()

  // 学期选择范围, 默认 "全部学期", 当选择具体学年时显示三个教学学期
  const pickerXQRange = useMemo(() => {
    if (picker[0] === 0)
      return ["全部学期"]

    return ["全部学期", "秋季学期", "春季学期", "夏季学期"]
  }, [picker])

  // 选择范围
  const pickerRange = useMemo(() => [pickerXNRange, pickerXQRange], [pickerXNRange, pickerXQRange])

  // 应用 picker 变化
  const handlePickerChange = () => {
    if (!user || !semester)
      return

    if (picker[0] === 0) {
      setForm(p => ({
        ...p,
        xn: undefined,
        xq: undefined,
      }))
    }

    setForm(p => ({
      ...p,
      xn: getXNFromName(pickerXNRange[picker[0]]),
      xq: getXQFromName(pickerXQRange[picker[1]]),
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
        hideToast()
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

    void showToast({
      title: "加载中...",
      icon: "loading",
    })
    void fetchRank(form)
  }

  return (
    <PageContent
      onRefresh={data ? () => fetchRank(data.request) : null}
      className="h-full"
    >
      {!user
        ? (
            <View className="h-full flex flex-col center gap">
              <Icon className="size-xl" src={EmptyIcon} />
              <View>个人信息加载失败</View>
            </View>
          )
        : (
            <View className="flex flex-col gap p">
              <Card>
                <CardContent className="flex flex-col gap">
                  <View className="flex items-center">
                    <View className="w">数据来源: </View>
                    <View className="flex flex-1 items-center gap">
                      <HDJWSwitchButton
                        active={form.data_source === "total"}
                        onClick={() => setForm(p => ({
                          ...p,
                          data_source: "total",
                        }))}
                      >
                        成绩主库
                      </HDJWSwitchButton>
                      <HDJWSwitchButton
                        active={form.data_source === "execution"}
                        onClick={() => setForm(p => ({
                          ...p,
                          data_source: "execution",
                        }))}
                      >
                        执行方案
                      </HDJWSwitchButton>
                    </View>
                  </View>

                  <View className="flex items-center">
                    <View className="w">课程范围: </View>
                    <View className="flex flex-1 items-center gap">
                      <HDJWSwitchButton
                        active={form.range === "major"}
                        onClick={() => setForm(p => ({
                          ...p,
                          range: "major",
                        }))}
                      >
                        主修
                      </HDJWSwitchButton>
                      <HDJWSwitchButton
                        active={form.range === "minor"}
                        onClick={() => setForm(p => ({
                          ...p,
                          range: "minor",
                        }))}
                      >
                        辅修
                      </HDJWSwitchButton>
                    </View>
                  </View>

                  <View className="flex items-center">
                    <View className="w">显示方式: </View>
                    <View className="flex flex-1 items-center gap">
                      <HDJWSwitchButton
                        active={form.display === "max"}
                        onClick={() => setForm(p => ({
                          ...p,
                          display: "max",
                        }))}
                      >
                        最大成绩
                      </HDJWSwitchButton>
                      <HDJWSwitchButton
                        active={form.display === "initial"}
                        onClick={() => setForm(p => ({
                          ...p,
                          display: "initial",
                        }))}
                      >
                        初修成绩
                      </HDJWSwitchButton>
                    </View>
                  </View>

                  <View className="flex items-center">
                    <View className="w">时间范围:</View>
                    <View className="flex flex-1 items-center gap">
                      <Picker
                        className="w-full"
                        range={pickerRange}
                        value={picker}
                        mode="multiSelector"
                        onColumnChange={(e) => {
                          const newPicker = [...picker]
                          newPicker[e.detail.column] = e.detail.value
                          setPicker(newPicker)
                        }}
                        onChange={() => handlePickerChange()}
                      >
                        <View
                          className="w-full py-xs border-base"
                          style={{
                            borderWidth: "0 0 1rpx 0",
                          }}
                        >
                          {pickerXNRange[picker[0]]}
                          {" "}
                          {pickerXQRange[picker[1]]}
                        </View>
                      </Picker>
                    </View>
                  </View>

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
                <>
                  <Card>
                    <CardContent className="flex flex-col">
                      <View className="flex gap">
                        <View>
                          {data.request.xn ? getXNName(data.request.xn) : "全部学年"}
                        </View>
                        <View>
                          {data.request.xq ? getXQName(data.request.xq) : "全部学期"}
                        </View>
                      </View>
                      <View className="flex">
                        {data.request.data_source === "total" ? "成绩主库" : "执行方案"}
                        {" / "}
                        {data.request.range === "major" ? "主修" : "辅修"}
                        {" / "}
                        {data.request.display === "max" ? "最大成绩" : "初修成绩"}
                      </View>
                    </CardContent>
                  </Card>

                  <RankContent data={data.response} />
                </>
              )}
            </View>
          )}
    </PageContent>
  )
}
