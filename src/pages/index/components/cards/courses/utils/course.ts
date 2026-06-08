import type { CourseItem } from "@/apis/models/course"
import type { CourseCard } from "@/pages/index/components/cards/courses"

/**
 * @description 获取初始卡片函数
 *   - 返回一个 CourseCard[12] 的 CourseCard 数组
 */
export function getInitCourseCards(): CourseCard[] {
  return Array.from({ length: 12 }).map((_, s) => ({
    start: s + 1,
    span: 1,
    items: [],
  } as CourseCard))
}

/**
 * @description 课程格式化函数
 *   - 返回一个 CourseCard[12] 的 CourseCard 数组
 *   - 将课程列表按节次划分为 12 个元素的数组, 每个元素为一个 CourseCard
 */
export function formatCourses(courses: CourseItem[]): CourseCard[] {
  const cards = getInitCourseCards()

  courses.forEach((course) => {
    const { time } = course

    if (time >= 1 && time <= 12) {
      cards[time - 1].items.push(course)
    }
  })

  return cards
}

/**
 * @description 合并课程卡片函数
 *   - 接收一个 CourseCard[12] 的课程卡片数组
 *   - 判断相邻的 CourseCard 是否可以合并, 并返回一个 CourseCard[] 的课程卡片数组, 已合并相邻且相同的课程卡片
 */
export function mergeCourseCards(cards: CourseCard[]): CourseCard[] {
  // 判断是否为同一课程
  const isSameCourse = (c1: CourseItem, c2: CourseItem) => {
    const keys = [
      "course_id",
      "course_name",
      "class_name",
      "type",
      "credit",
      // "weeks", 非基本类型, 需特殊处理
      "day",
      // "time", 课程合并不比较节次
      "extra",
      "area",
      "place",
      "people",
      "teacher",
      "customize_id",
    ] as const as Array<keyof CourseItem>

    // 基本类型的逐个字段校验
    if (!keys.every(k => c1[k] === c2[k]))
      return false

    // weeks 处理
    if (c1.weeks.length !== c2.weeks.length)
      return false

    return c1.weeks.every(i => c2.weeks.includes(i))
  }

  // 判断是否可以合并
  const isMergable = (c1: CourseCard, c2: CourseCard) => {
    // 需相连
    if (!(c1.start + c1.span === c2.start || c2.start + c2.span === c1.start))
      return false

    // 所含课程需相同
    if (c1.items.length !== c2.items.length)
      return false

    return c1.items.every(i1 => c2.items.some(i2 => isSameCourse(i1, i2)))
  }

  return cards.reduce((mergedList, card) => {
    const last = mergedList.at(-1)

    // 初始 mergedList 为空, last 不存在, 直接添加
    if (!last)
      return [card]

    // 判断是否允许合并
    if (isMergable(last, card)) {
      // 允许合并, 更新 last 跨度
      last.span += card.span
      return mergedList
    }

    // 追加到 mergedList
    return [...mergedList, card]
  }, [] as CourseCard[])
}
