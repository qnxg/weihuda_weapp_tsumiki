import type { CourseItem } from "@/apis/models/course"
import type { Semester } from "@/types/semester"
import { useCallback, useMemo } from "react"
import { STORAGE } from "@/config/storage-key"
import { useCachedRequest } from "@/hooks/cached-request"
import { mockRequest } from "@/utils/mock-request"

type Result = ReturnType<typeof useCachedRequest<CourseItem[]>>

const COURSE_MOCK_DATA: CourseItem[] = []

/**
 * @description 课表 Hook, 用于兼容 semester 未就绪时的缓存请求 Hook
 * @param {Semester | null} semester - 指定学期, 兼容 null 情况
 */
export function useCourse(semester: Semester | null): Result {
  // 在 semester 未就绪时使用一个立即 resolve 的空请求函数, 以兼容 useCachedRequest
  // 为使类型定义更为简单, 使用 mockRequest 作为上述 "立即 resolve 的空请求函数"
  const fn = useCallback(() => semester
    // ? api.course.get(semester)
    ? mockRequest(COURSE_MOCK_DATA) // 开发中的 mock 数据
    : mockRequest([], { delay: 0 }), [semester])

  const key = useMemo(() => semester
    ? `${STORAGE.page.table.course.prefix}_${semester.xn}_${semester.xq}`
    : `${STORAGE.page.table.course.prefix}_${STORAGE.page.table.course.placeholder}`, [semester])

  return useCachedRequest(fn, key, { enabled: !!semester })
}
