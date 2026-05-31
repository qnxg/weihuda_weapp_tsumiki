import type { ReactNode } from "react"
import type { SemesterInfo } from "@/types/semester"
import { createContext, useContext, useMemo, useState } from "react"

interface SemesterContextValue {
  semesters: SemesterInfo[]
  currentSemester: SemesterInfo | null
  setSemesters: (semesters: SemesterInfo[] | ((prev: SemesterInfo[]) => SemesterInfo[])) => void
  setCurrentSemester: (semester: SemesterInfo | null) => void
}

const SemesterContext = createContext<SemesterContextValue | null>(null)

export function SemesterProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [semesters, setSemesters] = useState<SemesterInfo[]>([])
  const [currentSemester, setCurrentSemester] = useState<SemesterInfo | null>(null)

  const value = useMemo(() => ({
    semesters,
    currentSemester,
    setSemesters,
    setCurrentSemester,
  }), [semesters, currentSemester])

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
