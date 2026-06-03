import type { RequestError } from "@/types/request"
import type { Semester } from "@/types/semester"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/apis"
import { useSemesterContext } from "@/contexts/semester"

interface UseSemesterResult {
  data: SemesterInfo | null
  isLoading: boolean
  error: RequestError | null
}

type SemesterInfo = Awaited<ReturnType<typeof api.semester>>["data"]

/**
 * @description 学期信息 Hook
 *   - mount 时自动请求本学期信息并缓存
 *   - 传入参数可获取指定学期信息
 */
export function useSemester(s?: Semester): UseSemesterResult {
  const { getSemester, setSemester } = useSemesterContext()

  const [data, setData] = useState<SemesterInfo | null>(null)
  const [error, setError] = useState<RequestError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSemester = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.semester(s)
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
  }, [s])

  useEffect(() => {
    const semester = getSemester(s)
    if (semester) {
      setData(semester)
      setIsLoading(false)
      return
    }

    void fetchSemester().then((res) => {
      if (res) {
        const isCurrent = !s
        setSemester(res, isCurrent)
        setData(res)
      }
    })
  }, [s, getSemester, setSemester, fetchSemester])

  return { data, isLoading, error }
}
