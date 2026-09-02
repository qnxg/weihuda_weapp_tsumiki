import type { FAQItem } from "@/pages/feedback/components/faq-data"
import { Option, Options } from "@/components/options"
import { TabContent, TabItem, TabList, Tabs, TabTrigger } from "@/components/tabs"
import { FAQS } from "@/pages/feedback/components/faq-data"

/**
 * @description 常见问题组件, 用 Tabs 分类展示问题列表, 点击条目后通过回调触发展示答案
 */
export function Faq({ onSelect }: Readonly<{
  onSelect: (faq: FAQItem) => void
}>) {
  return (
    <Tabs defaultValue={FAQS[0].title}>
      <TabList>
        {FAQS.map(category => (
          <TabTrigger key={category.title} value={category.title}>
            {category.title}
          </TabTrigger>
        ))}
      </TabList>
      <TabContent>
        {FAQS.map(category => (
          <TabItem key={category.title} value={category.title}>
            <Options type="divided">
              {category.items.map(faq => (
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
