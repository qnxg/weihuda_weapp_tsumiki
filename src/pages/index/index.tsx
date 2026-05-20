import { Text } from "@tarojs/components"
import { showModal } from "@tarojs/taro"
import { MyButton } from "@/components/button"
import { Page, PageContent } from "@/components/page"

export default function Index() {
  return (
    <Page>
      <PageContent>
        <Text className="text-xl text-hightlight">Hello world!</Text>
        <Text className="text-md text-primary">base</Text>
        <MyButton
          className="fit px-lg py-sm bg-primary rounded-sm"
          to="/pages/toolkit/index"
        >
          Tool
        </MyButton>
        <MyButton
          className="fit px-lg py-sm bg-primary rounded-full"
          to="/tools/pages/grade/grade/index"
        >
          Grade
        </MyButton>
        <MyButton
          className="fit px-lg py-sm bg-primary rounded-full"
          onClick={() => void showModal({
            title: "提示",
            content: "这是一个模态框",
            showCancel: true,
            cancelText: "取消",
            confirmText: "确定",
          })}
        >
          Open Modal
        </MyButton>
      </PageContent>
    </Page>
  )
}
