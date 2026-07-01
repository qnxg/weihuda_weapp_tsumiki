import type { ClasstableItem } from "@/apis/models/classtable"
import type { Cell, CourseItemWithColor } from "@/pages/table"
import { BG_COLOR, FONT_COLOR } from "@/config/color"

const COLOR_NUM = Math.min(BG_COLOR.length, FONT_COLOR.length)

/**
 * @description 获取初始单元格函数
 *   - 返回一个 Cell[7][12] 的二维 Cell 数组
 */
export function getInitCells(): Cell[][] {
  return Array.from({ length: 7 }).map((_, d) =>
    Array.from({ length: 12 }).map((_, s) => ({
      day: d,
      start: s + 1,
      span: 1,
      items: [],
    } as Cell)))
}

/**
 * @description 课程染色函数
 *   - 根据课程名称为课程进行循环染色
 *   - 先染色固定课程, 再染色自定义课程, 确保同名课程颜色一致, 不同课程颜色尽可能不同
 */
export function colorCourses(courses: ClasstableItem[]): CourseItemWithColor[] {
  // 获取课程名称列表并去重排序
  const getNames = (courses: ClasstableItem[]) => Array.from(
    new Set(courses.map(c => c.course_name)),
  ).toSorted((a, b) => a.localeCompare(b, "zh-CN"))

  // 循环染色函数
  const colorizer = (courses: ClasstableItem[], names: string[], start: number = 0): CourseItemWithColor[] => {
    const map = new Map<string, number>(
      names.map((n, i) => [n, (i + start) % COLOR_NUM]),
    )

    return courses.map(c => ({
      ...c,
      bgColor: BG_COLOR[map.get(c.course_name) ?? 0],
      color: FONT_COLOR[map.get(c.course_name) ?? 0],
    }))
  }

  const fixedCourses = courses.filter(c => c.customize_id == null)
  const customizedCourses = courses.filter(c => c.customize_id != null)
  const fixedCourseNames = getNames(fixedCourses)
  const customizedCourseNames = getNames(customizedCourses)

  const coloriedFixedCourses = colorizer(fixedCourses, fixedCourseNames)
  const coloriedCustomizedCourses = colorizer(customizedCourses, customizedCourseNames, fixedCourseNames.length)

  return [...coloriedFixedCourses, ...coloriedCustomizedCourses]
}

/**
 * @description 课程格式化函数
 *   - 返回一个 Cell[7][12] 的二维 Cell 数组
 *   - 将课程列表按天划分为 7 个元素的数组, 每个元素为一个 Cell[]
 *   - 每个 Cell[] 数组包含 12 个 Cell, 表示 12 个课节
 *   - 每个 Cell 包含该单元格的课程信息
 */
export function formatCourses(courses: CourseItemWithColor[]): Cell[][] {
  const cells = getInitCells()

  courses.forEach((course) => {
    const { day, time } = course

    if (day >= 0 && day < 7 && time >= 1 && time <= 12) {
      cells[day][time - 1].items.push(course)
    }
  })

  return cells
}

/**
 * @description 合并单元格函数
 *   - 接收一个 Cell[7][12] 的二维 Cell 数组
 *   - 按天遍历每个 Cell[], 判断相邻的 Cell 是否可以合并
 *   - 返回一个 Cell[7][] 的二维 Cell 数组, 每个 Cell[] 中的 Cell 已合并
 */
export function mergeCells(cells: Cell[][]): Cell[][] {
  // 判断是否为同一课程
  const isSameCourse = (c1: CourseItemWithColor, c2: CourseItemWithColor) => {
    const keys = [
      "course_id",
      "course_name",
      "class_name",
      "course_type",
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
      "bgColor",
      "color",
    ] as const as Array<keyof CourseItemWithColor>

    // 基本类型的逐个字段校验
    if (!keys.every(k => c1[k] === c2[k]))
      return false

    // weeks 处理
    if (c1.weeks.length !== c2.weeks.length)
      return false

    return c1.weeks.every(i => c2.weeks.includes(i))
  }

  // 判断是否可以合并
  const isMergable = (c1: Cell, c2: Cell) => {
    // 需位于同一天
    if (c1.day !== c2.day)
      return false

    // 需相连
    if (!(c1.start + c1.span === c2.start || c2.start + c2.span === c1.start))
      return false

    // 所含课程需相同
    if (c1.items.length !== c2.items.length)
      return false

    return c1.items.every(i1 => c2.items.some(i2 => isSameCourse(i1, i2)))
  }

  return cells.map(dayCells =>
    // 按天遍历
    dayCells.reduce((mergedList, cell) => {
      const last = mergedList.at(-1)

      // 初始 mergedList 为空, last 不存在, 直接添加
      if (!last)
        return [cell]

      // 判断是否允许合并
      if (isMergable(last, cell)) {
        // 允许合并, 更新 last 跨度
        last.span += cell.span
        return mergedList
      }

      // 追加到 mergedList
      return [...mergedList, cell]
    }, [] as Cell[]))
}
