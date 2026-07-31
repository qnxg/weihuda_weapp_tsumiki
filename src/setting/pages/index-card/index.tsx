import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { Card, CardContent } from "@/components/card"
import { MyButton } from "@/components/my-button"
import { Page, PageContent } from "@/components/page"
import { SortableList } from "./components/sortable-list"
import { useCardSort } from "./hooks/useCardSort"

export default function IndexCard() {
  const {
    items,
    isLoading,
    isUpdating,
    moveItem,
    toggleItem,
    selectAll,
    deselectAll,
    resetToDefault,
    save,
  } = useCardSort()

  const handleSave = async () => {
    try {
      await save()
      void Taro.showToast({
        title: "保存成功",
        icon: "success",
      })
    }
    catch {
      void Taro.showToast({
        title: "保存失败",
        icon: "error",
      })
    }
  }

  return (
    <Page isLoading={isLoading}>
      <PageContent className="h-full">
        <View className="flex flex-col gap-lg p">
          {/* 顶部提示 */}
          <Card>
            <CardContent className="px">
              <View className="text-base py-sm">
                拖拽右侧图标可调整卡片顺序, 点击左侧圆点可启用 / 禁用卡片, 修改后请点击保存.
              </View>
            </CardContent>
          </Card>

          {/* 按钮区: 横向 4 按钮 */}
          <View className="flex gap-sm">
            <MyButton
              active
              className="flex-1 rounded-md py-sm text-center text-md"
              disabled={isUpdating}
              onClick={() => void handleSave()}
            >
              {isUpdating ? "保存中" : "保存"}
            </MyButton>
            <MyButton
              className="flex-1 rounded-md py-sm text-center text-md"
              onClick={selectAll}
            >
              全选
            </MyButton>
            <MyButton
              className="flex-1 rounded-md py-sm text-center text-md"
              onClick={deselectAll}
            >
              全不选
            </MyButton>
            <MyButton
              className="flex-1 rounded-md py-sm text-center text-md"
              onClick={resetToDefault}
            >
              重置为默认
            </MyButton>
          </View>

          {/* 排序列表 */}
          <Card>
            <CardContent>
              <SortableList
                items={items}
                onMove={moveItem}
                onToggle={toggleItem}
              />
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
