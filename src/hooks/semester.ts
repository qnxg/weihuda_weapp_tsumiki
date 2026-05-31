import type { RequestError } from "@/types/request"
import type { Semester, SemesterIdentifier, SemesterInfo, Year } from "@/types/semester"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/apis"
import { useSemesterContext } from "@/contexts/semester"

interface UseSemesterResult {
  data: SemesterInfo | null
  isLoading: boolean
  error: RequestError | null
}

/**
 * @description 学期信息 Hook
 *   - mount 时自动请求本学期信息并缓存
 *   - 传入参数可获取指定学期信息
 */
export function useSemester(args?: SemesterIdentifier): UseSemesterResult {
  const {
    semesters,
    currentSemester,
    setSemesters,
    setCurrentSemester,
  } = useSemesterContext()

  const [data, setData] = useState<SemesterInfo | null>(null)
  const [error, setError] = useState<RequestError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 检查 semesters 中是否存在指定学期
  const hasSemester = useCallback((year: Year, semester: Semester) => {
    return semesters.some(
      item => item.year === year && item.semester === semester,
    )
  }, [semesters])

  // 更新或添加学期信息到 semesters 中
  const upsertSemester = useCallback((semester: SemesterInfo) => {
    setSemesters((prev) => {
      if (hasSemester(semester.year, semester.semester)) {
        return prev.map(item =>
          item.year === semester.year && item.semester === semester.semester
            ? semester
            : item,
        )
      }
      return [...prev, semester]
    })
  }, [setSemesters, hasSemester])

  // 请求学期信息
  const fetchSemester = useCallback(async (year?: Year, semester?: Semester) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.semester(
        year !== undefined && semester !== undefined
          ? { year, semester }
          : undefined,
      )
      return res.data
    }
    catch (err) {
      const requestError = err as RequestError
      setError(requestError)
      return null
    }
    finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // args 存在
    if (args) {
      if (hasSemester(args.year, args.semester)) {
        const semester = semesters.find(
          item => item.year === args.year && item.semester === args.semester,
        )
        setData(semester!)
        return
      }

      void fetchSemester(args.year, args.semester).then((semester) => {
        if (semester) {
          upsertSemester(semester)
          setData(semester)
        }
      })
      return
    }

    // args 不存在, 为当前学期
    if (currentSemester !== null) {
      setData(currentSemester)
      return
    }

    void fetchSemester().then((semester) => {
      if (semester) {
        upsertSemester(semester)
        setCurrentSemester(semester)
        setData(semester)
      }
    })
  }, [args, semesters, currentSemester, fetchSemester, setSemesters, setCurrentSemester, hasSemester, upsertSemester])

  return { data, isLoading, error }
}
