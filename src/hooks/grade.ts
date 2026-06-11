import type { GradeItem } from "@/apis/models/grade"
import type { Semester } from "@/types/semester"
import { useCallback } from "react"
import { api } from "@/apis"
import { useRequest } from "@/hooks/request"
import { mockRequest } from "@/utils/mock-request"

/**
 * @description 成绩 Hook, 用于兼容 semester 未就绪时的请求
 * @param {Semester | null} semester - 指定学期, 兼容 null 情况
 */
export function useGrade(semester: Semester | null) {
  const fn = useCallback(() => semester
    ? api.grade.get(semester)
    : mockRequest<GradeItem[]>([], { delay: 0 }), [semester])

  return useRequest(fn, [semester])
}
