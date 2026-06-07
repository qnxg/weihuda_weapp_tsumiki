import type { RequestError } from "@/types/request"
import type { Semester, SemesterInfo } from "@/types/semester"
import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import { STORAGE } from "@/config/storage-key"
import { useSemesterContext } from "@/contexts/semester"
import { Storage } from "@/utils/storage"

const semesterStorage = new Storage<SemesterInfo>(STORAGE.semester.current)

/**
 * @property {SemesterInfo | null} data - 学期信息
 * @property {boolean} isLoading - 加载状态
 * @property {RequestError | null} error - 错误信息
 */
interface UseSemesterResult {
  data: SemesterInfo | null
  isLoading: boolean
  error: RequestError | null
}

/**
 * @description 学期信息 Hook
 *   - mount 时自动请求本学期信息并缓存
 *   - 传入参数可获取指定学期信息
 *   - fetch 失败时使用 storage 降级
 */
export function useSemester(s?: Semester): UseSemesterResult {
  const { getSemester, setSemester } = useSemesterContext()

  const [data, setData] = useState<SemesterInfo | null>(null)
  const [error, setError] = useState<RequestError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getSemesterRef = useRef(getSemester)
  getSemesterRef.current = getSemester
  const setSemesterRef = useRef(setSemester)
  setSemesterRef.current = setSemester

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

  const fetchSemesterRef = useRef(fetchSemester)
  fetchSemesterRef.current = fetchSemester

  useEffect(() => {
    const semester = getSemesterRef.current(s)
    if (semester) {
      setData(semester)
      setIsLoading(false)
      return
    }

    void fetchSemesterRef.current().then((res) => {
      if (res) {
        const isCurrent = !s
        setSemesterRef.current(res, isCurrent)
        setData(res)
        if (isCurrent) {
          void semesterStorage.set(res)
        }
      }
      else {
        // fetch 失败, 使用 storage 降级
        semesterStorage.get().then((storageData) => {
          if (storageData) {
            setSemesterRef.current(storageData, !s)
            setData(storageData)
          }
        })
      }
    })
  }, [s])

  return { data, isLoading, error }
}
