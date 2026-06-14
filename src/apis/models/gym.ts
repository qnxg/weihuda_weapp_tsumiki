/**
 * @description 体测单项成绩
 * @property {string} color - 颜色标识
 * @property {string} rank - 成绩等级
 * @property {string} grade - 成绩
 * @property {number} score - 得分
 */
export interface GymGradeDetail {
  color: "green" | "red"
  rank: string
  grade: string
  score: number
}

/**
 * @description 左右眼视力详情
 * @property {string} value - 值
 * @property {string} desc - 描述
 */
export interface EyeGradeDetail {
  value: string
  desc: string
}

/**
 * @description 视力成绩
 * @property {EyeGradeDetail} sight - 裸视力
 * @property {EyeGradeDetail} mirror - 串镜视力
 * @property {EyeGradeDetail} ametropia - 屈光不正视力
 */
export interface EyeGrade {
  sight: EyeGradeDetail
  mirror: EyeGradeDetail
  ametropia: EyeGradeDetail
}

/**
 * @description 体测成绩
 * @property {string} grade - 总成绩的文字描述
 * @property {number} score - 总成绩
 * @property {string} report_desc - 体测成绩描述
 * @property {string} report_status - 体测成绩状态
 * @property {string} report_type - 体测成绩类型
 * @property {EyeGrade} eye - 视力成绩
 * @property {GymGradeDetail} short_run - 50m 成绩
 * @property {GymGradeDetail} bmi - BMI 成绩
 * @property {GymGradeDetail} jump - 跳远成绩
 * @property {GymGradeDetail} pull_and_sit - 引体向上/仰卧起坐成绩
 * @property {GymGradeDetail} run - 长跑成绩
 * @property {GymGradeDetail} sit_and_reach - 坐位体前屈成绩
 * @property {GymGradeDetail} vc - 肺活量成绩
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582600
 */
export interface GymGrade {
  grade: string
  score: number
  report_desc: string
  report_status: string
  report_type: string
  eye: EyeGrade
  short_run: GymGradeDetail
  bmi: GymGradeDetail
  jump: GymGradeDetail
  pull_and_sit: GymGradeDetail
  run: GymGradeDetail
  sit_and_reach: GymGradeDetail
  vc: GymGradeDetail
}

/**
 * @description 获取体测成绩响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582600
 */
export type GymGradeResponse = GymGrade

/**
 * @description 获取体测成绩请求数据
 * @property {number} [xn] - 学年
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582600
 */
export interface GymGradeRequest {
  xn?: number
}

/**
 * @description 体测预约项
 * @property {string} name - 预约名称
 * @property {string} desc - 预约描述
 * @property {string} show_date - 体测系统显示的预约时间
 * @property {string} time - 时间段
 * @property {string} test_type - 预约项目
 * @property {string} status - 预约状态
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582601
 */
export interface GymAppointmentItem {
  name: string
  desc: string
  show_date: string
  time: string
  test_type: string
  status: string
}

/**
 * @description 获取体测预约信息响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582601
 */
export type GymAppointmentResponse = GymAppointmentItem[]
