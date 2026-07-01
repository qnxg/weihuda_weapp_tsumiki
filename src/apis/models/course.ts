import type { Semester } from "@/types/semester"

/**
 * @description 无课表课程项
 * @property {string} course_id - 课程代码
 * @property {string} course_name - 课程名称
 * @property {string} class_name - 上课班级
 * @property {string} course_type - 课程类型, 如通识必修, 专业选修
 * @property {number} credit - 学分
 * @property {string | null} extra - 额外备注信息
 * @property {string} area - 校区
 * @property {number} people - 人数
 * @property {string} teacher - 教师
 * @see https://app.apifox.com/link/project/8311217/apis/api-467462029
 */
export interface ExtraCourseItem {
  course_id: string
  course_name: string
  class_name: string
  course_type: string
  credit: number
  extra: string | null
  area: string
  people: number
  teacher: string
}

/**
 * @description 自定义课程请求体
 * @property {string} course_name - 课程名称
 * @property {number[]} weeks - 周次
 * @property {number} day - 周几上课, 周日为 0, 周一为 1
 * @property {number[]} times - 节次, 1 到 12
 * @property {string | null} place - 上课地点
 * @property {string | null} teacher - 教师
 */
export interface CustomCourseRequest {
  course_name: string
  weeks: number[]
  day: number
  times: number[]
  place: string | null
  teacher: string | null
}

/**
 * @description 获取无课表课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-467462029
 */
export type CourseGetExtraRequest = Semester

/**
 * @description 获取无课表课程响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-467462029
 */
export type CourseGetExtraResponse = ExtraCourseItem[]

/**
 * @description 添加自定义课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465968797
 */
export interface CourseCustomPostRequest {
  xn: number
  xq: Semester["xq"]
  course: CustomCourseRequest
}

/**
 * @description 编辑自定义课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465969451
 */
export type CourseCustomPutRequest = CustomCourseRequest
