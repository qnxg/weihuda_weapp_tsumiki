import { Switch, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
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

  const handleToggleDisplay = () => {
    if (!tableSetting)
      return

    void updateTableSetting({
      ...tableSetting,
      setting: {
        ...tableSetting.setting,
        displayNotCurrentWeekCourses: !tableSetting.setting.displayNotCurrentWeekCourses,
      },
    })
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
                      checked={tableSetting?.setting.displayNotCurrentWeekCourses ?? false}
                      disabled={isUpdating}
                      onChange={() => handleToggleDisplay()}
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
