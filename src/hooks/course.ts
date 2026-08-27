import type { ClasstableItem } from "@/apis/models/classtable"
import type { ExtraCourseItem } from "@/apis/models/course"
import type { Semester } from "@/types/semester"
import { useCallback, useMemo } from "react"
import { api } from "@/apis"
import { STORAGE } from "@/config/storage-key"
import { useCachedQuery } from "@/hooks/request"

type CourseResult = ReturnType<typeof useCachedQuery<ClasstableItem[]>>
type ExtraCourseResult = ReturnType<typeof useCachedQuery<ExtraCourseItem[]>>

/**
 * @description 课表 Hook, 用于兼容 semester 未就绪时的缓存请求 Hook
 * @param {Semester | null} semester - 指定学期, 兼容 null 情况
 */
export function useCourse(semester: Semester | null): CourseResult {
  const fn = useCallback(() => api.classtable.get(semester!), [semester])

  const key = useMemo(() => semester
    ? `${STORAGE.page.table.course.prefix}_${semester.xn}_${semester.xq}`
    : `${STORAGE.page.table.course.prefix}_${STORAGE.page.table.course.placeholder}`, [semester])

  return useCachedQuery(fn, [semester], key, { enabled: !!semester })
}

/**
 * @description 无课表课程 Hook, 用于兼容 semester 未就绪时的缓存请求 Hook
 * @param {Semester | null} semester - 指定学期, 兼容 null 情况
 */
export function useExtraCourse(semester: Semester | null): ExtraCourseResult {
  const fn = useCallback(() => api.course.getExtra(semester!), [semester])

  const key = useMemo(() => semester
    ? `${STORAGE.page.table.extra.prefix}_${semester.xn}_${semester.xq}`
    : `${STORAGE.page.table.extra.prefix}_${STORAGE.page.table.course.placeholder}`, [semester])

  return useCachedQuery(fn, [semester], key, { enabled: !!semester })
}
