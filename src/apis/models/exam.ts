/**
 * @description 考试安排项
 * @property {string} course_id - 课程代码，自定义考试安排为 NULL
 * @property {string} course_name - 课程名称/考试名称
 * @property {string} area - 考试校区/考试地点
 * @property {string} classroom - 考试的教室/考场
 * @property {string} date - 考试日期
 * @property {string} start_time - 开始时间
 * @property {string} end_time - 结束时间
 * @property {string} seat - 座位号
 * @property {number} customize_id - 自定义考试安排 id，非自定义考试安排为 -1
 */
export interface ExamScheduleItem {
  course_id: string | null
  course_name: string
  area: string | null
  classroom: string | null
  date: string | null
  start_time: string | null
  end_time: string | null
  seat: string | null
  customize_id: number
}

/**
 * @description 获取考试安排列表响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582589
 */
export type ExamResponse = ExamScheduleItem[]

/**
 * @description 添加自定义考试安排请求数据
 * @property {string} course_name - 考试名称
 * @property {string} area - 考试地点
 * @property {string} classroom - 考场
 * @property {string} seat - 座位号
 * @property {string} date - 考试日期
 * @property {string} start_time - 开始时间
 * @property {string} end_time - 结束时间
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582590
 */
export interface ExamPostRequest {
  course_name: string
  area: string | null
  classroom: string | null
  seat: string | null
  date: string
  start_time: string
  end_time: string
}

/**
 * @description 修改自定义考试安排请求数据
 */
export type ExamPutRequest = ExamPostRequest
