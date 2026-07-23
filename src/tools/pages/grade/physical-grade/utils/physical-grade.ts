import type { GymGrade, GymGradeDetail } from "@/apis/models/gym"
import type { PhysicalGradeItem } from "@/tools/pages/grade/physical-grade"
import type { Sex } from "@/types/auth"

// 保证类型为 GymGrade 字段, 且对应字段为 GymGradeDetail 类型
type GymGradeDetailKeys = {
  [K in keyof GymGrade]: GymGrade[K] extends GymGradeDetail ? K : never
}[keyof GymGrade]

/**
 * @description 体测成绩格式化函数
 */
export function formatPhysicalGrade(grade: GymGrade, sex: Sex): PhysicalGradeItem[] {
  const NAME_LIST = [
    "50m",
    "BMI",
    "跳远",
    sex === "Male" ? "引体向上" : "仰卧起坐",
    "长跑",
    "坐位体前屈",
    "肺活量",
  ]

  const KEY_LIST = [
    "short_run",
    "bmi",
    "jump",
    "pull_and_sit",
    "run",
    "sit_and_reach",
    "vc",
  ] as const satisfies readonly GymGradeDetailKeys[]

  const PERCENTAGE_LIST = [20, 15, 10, 10, 20, 10, 15]

  return KEY_LIST.map((key, index) => ({
    name: NAME_LIST[index],
    color: grade[key].color,
    percentage: PERCENTAGE_LIST[index],
    rank: grade[key].rank,
    grade: grade[key].grade,
    score: grade[key].score,
  }))
}
