import type { ReactNode } from "react"
import type { Semester, SemesterInfo } from "@/types/semester"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

interface SemesterContextValue {
  getSemester: (s?: Semester) => SemesterInfo | null
  setSemester: (s: SemesterInfo, isCurrent?: boolean) => void
}

const SemesterContext = createContext<SemesterContextValue | null>(null)

export function SemesterProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [semesters, setSemesters] = useState<SemesterInfo[]>([])
  const [current, setCurrent] = useState<number | null>(null)

  const getSemester = useCallback((s?: Semester): SemesterInfo | null => {
    if (!s) {
      return current !== null ? semesters[current] ?? null : null
    }

    return semesters.find(item => item.xn === s.xn && item.xq === s.xq) ?? null
  }, [semesters, current])

  const setSemester = useCallback((s: SemesterInfo, isCurrent = false) => {
    const index = semesters.findIndex(item => item.xn === s.xn && item.xq === s.xq)

    if (index >= 0) {
      setSemesters(prev => prev.map((item, i) => i === index ? s : item))
      if (isCurrent)
        setCurrent(index)
    }
    else {
      setSemesters(prev => [...prev, s])
      if (isCurrent)
        setCurrent(semesters.length)
    }
  }, [semesters])

  const value = useMemo(() => ({
    getSemester,
    setSemester,
  }), [getSemester, setSemester])

  return (
    <SemesterContext.Provider value={value}>
      {children}
    </SemesterContext.Provider>
  )
}

export function useSemesterContext() {
  const context = useContext(SemesterContext)
  if (!context) {
    throw new Error("useSemesterContext must be used within a SemesterProvider")
  }
  return context
}
