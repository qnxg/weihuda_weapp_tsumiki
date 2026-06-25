import type { ExamScheduleItem } from "@/apis/models/exam"
import { useState } from "react"
import { api } from "@/apis"
import { Overlay } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { TabList, Tabs, TabTrigger } from "@/components/tabs"
import { useRequest } from "@/hooks/request"
import { Custom } from "@/tools/pages/exam/exam/components/custom"
import { Detail } from "@/tools/pages/exam/exam/components/detail"
import { List } from "@/tools/pages/exam/exam/components/list"

/**
 * @description 覆盖层内容类型
 *   - 考试详情
 *   - 自定义考试安排(新增/编辑)
 */
type OverlayContentKey = "detail" | "custom"

type TabValue = "list" | "calender"

export default function ExamArrange() {
  const { data, isLoading, refetch } = useRequest(
    () => api.exam.get(),
    [],
    { refetchClearData: false },
  )

  const [tab, setTab] = useState<TabValue>("list")

  // 覆盖层内容类型, null 为不显示
  const [overlayContentKey, setOverlayContentKey] = useState<OverlayContentKey | null>(null)

  // 详情 / 编辑内容
  const [activeExam, setActiveExam] = useState<ExamScheduleItem | null>(null)

  return (
    <Page>
      <Tabs
        value={tab}
        onChange={(e: TabValue) => setTab(e)}
      >
        <TabList>
          <TabTrigger value="list">全部考试</TabTrigger>
          <TabTrigger value="calender">考试日历</TabTrigger>
        </TabList>
      </Tabs>

      <PageContent
        className="h-full"
        isLoading={isLoading && !data}
        onRefresh={refetch}
      >
        {tab === "list" && (
          <List
            data={data}
            onShowDetail={(item) => {
              setActiveExam(item)
              setOverlayContentKey("detail")
            }}
          />
        )}
      </PageContent>

      {overlayContentKey && (
        <Overlay>
          {overlayContentKey === "detail" && activeExam && (
            <Detail
              exam={activeExam}
              onClose={() => {
                setActiveExam(null)
                setOverlayContentKey(null)
              }}
              onDelete={() => {
                setActiveExam(null)
                setOverlayContentKey(null)
                void refetch()
              }}
              onEdit={() => setOverlayContentKey("custom")}
            />
          )}
          {overlayContentKey === "custom" && (
            <Custom
              exam={activeExam}
              onCancel={() => {
                setActiveExam(null)
                setOverlayContentKey(null)
              }}
              onConfirm={() => {
                setActiveExam(null)
                setOverlayContentKey(null)
                void refetch()
              }}
            />
          )}
        </Overlay>
      )}
    </Page>
  )
}
