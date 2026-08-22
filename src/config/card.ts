/**
 * @description 首页卡片元数据
 * @property {string} key - 卡片唯一标识
 * @property {string} name - 卡片中文名称
 */
export interface CardMeta {
  key: string
  name: string
}

/**
 * @description 全部首页卡片元数据, 卡片元信息 (key / name) 的单一事实源
 *   - 首页 `cards/index.tsx` 据此挂载渲染内容
 *   - 设置页 `card-sort.ts` 据此获取名称映射与卡片全集
 *   - 数组顺序即卡片全集的默认展示顺序
 */
export const CARD_METAS: CardMeta[] = [
  { key: "jifen", name: "积分" },
  { key: "courses", name: "课程" },
  { key: "netflow", name: "流量" },
  { key: "electricity", name: "电量" },
  { key: "campus_card", name: "校园卡余额" },
  { key: "tasks", name: "近期待办" },
  { key: "count_down", name: "假期倒计时" },
  { key: "email", name: "校园邮箱" },
  { key: "grade", name: "成绩查询" },
]
