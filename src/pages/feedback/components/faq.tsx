import type { FaqObject } from "@/pages/feedback/components/faq-data"
import { Option, Options } from "@/components/options"
import { TabContent, TabItem, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { FAQS } from "@/pages/feedback/components/faq-data"

/**
 * @description 常见问题组件, 用 Tabs 分类展示问题列表, 点击条目后通过回调触发展示答案
 */
export function Faq({ onSelect }: Readonly<{
  onSelect: (faq: FaqObject) => void
}>) {
  return (
    <Tabs defaultValue={Object.keys(FAQS)[0]}>
      <TabList>
        {Object.keys(FAQS).map(category => (
          <TabTrigger key={category} value={category}>
            {category}
          </TabTrigger>
        ))}
      </TabList>
      <TabContent>
        {Object.entries(FAQS).map(([category, list]) => (
          <TabItem key={category} value={category}>
            <Options type="divided">
              {list.map(faq => (
                <Option
                  key={faq.q}
                  title={faq.q}
                  onClick={() => onSelect(faq)}
                />
              ))}
            </Options>
          </TabItem>
        ))}
      </TabContent>
    </Tabs>
  )
}
