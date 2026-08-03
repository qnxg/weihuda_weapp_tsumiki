import { Switch, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Option, Options } from "@/components/options"
import { Page, PageContent } from "@/components/page"
import { STORAGE } from "@/config/storage-key"
import { useSetting } from "@/hooks/setting"
import ClearIcon from "@/static/setting/class-table/clear.svg"
import EditIcon from "@/static/setting/class-table/edit.svg"
import { showModal } from "@/utils/modal"
import { clearStorageByPrefix } from "@/utils/storage"

export default function ClassTable() {
  const { settings, isLoading, isUpdating, updateTableSetting } = useSetting()

  const tableSetting = settings.tableSetting

  // context 权威值
  const contextChecked = tableSetting?.setting.displayNotCurrentWeekCourses ?? false
  // 本地乐观镜像, 点击后立即反馈, 避免受控 Switch 等待异步 API 返回时回弹
  const [checked, setChecked] = useState(contextChecked)

  // 权威值变化时 (加载完成 / 保存成功) 同步本地镜像
  useEffect(() => {
    setChecked(contextChecked)
  }, [contextChecked])

  const handleToggleDisplay = async () => {
    if (!tableSetting)
      return

    const next = !checked
    // 乐观更新, 立即反馈
    setChecked(next)
    try {
      await updateTableSetting({
        ...tableSetting,
        setting: {
          ...tableSetting.setting,
          displayNotCurrentWeekCourses: next,
        },
      })
    }
    catch {
      // 失败回滚
      setChecked(!next)
      void Taro.showToast({
        title: "保存失败",
        icon: "error",
      })
    }
  }

  const handleClearCache = () => {
    void showModal(
      "确认清除",
      "清除后将重新拉取课表数据",
      "dangerous",
      async () => {
        clearStorageByPrefix(
          STORAGE.page.table.course.prefix,
          STORAGE.page.table.extra.prefix,
        )
        await Taro.showToast({
          title: "清除成功",
        })
      },
    )
  }

  return (
    <Page isLoading={isLoading}>
      <PageContent fixed className="h-full">
        <View className="h-full flex flex-col gap p">
          <Card className="text-xl">
            <CardContent className="px">
              <Options>
                <Option
                  title="显示非本周课程"
                  icon={EditIcon}
                  size="lg"
                  content={(
                    <Switch
                      // 同 primary
                      color="#328ccb"
                      controlled="true"
                      style={{
                        transform: "scale(0.8)",
                      }}
                      checked={checked}
                      disabled={isUpdating}
                      onChange={() => void handleToggleDisplay()}
                    />
                  )}
                />
                <Option
                  title="清除课表缓存"
                  icon={ClearIcon}
                  size="lg"
                  onClick={() => handleClearCache()}
                />
              </Options>
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
