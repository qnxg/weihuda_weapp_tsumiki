import type { Semester } from "@/types/semester"

/**
 * @description 课程信息
 * @property {string} course_id - 课程 ID
 * @property {string} course_name - 课程名称
 * @property {string} class_name - 班级名称
 * @property {string} type - 课程类型, 选修 / 必修等
 * @property {number} credit - 学分
 * @property {number[]} weeks - 周次
 * @property {number} day - 课程日, 从 0 开始, 0 表示周日
 * @property {number} time - 节次, 1 - 12
 * @property {string} extra - 额外信息
 * @property {string} area - 校区
 * @property {string} place - 地点
 * @property {number} people - 人数
 * @property {string} teacher - 教师
 * @property {number} customize_id - 自定义课程 ID, 非自定义课程为 -1
 */
export interface CourseItem {
  course_id: string
  course_name: string
  class_name: string
  type: string
  credit: number
  weeks: number[]
  day: number
  time: number
  extra: string
  area: string
  place: string
  people: number
  teacher: string
  customize_id: number
}

/**
 * @description 额外课程(无课表课程)信息
 * @property {string} course_id - 课程 ID
 * @property {string} course_name - 课程名称
 * @property {string} class_name - 班级名称
 * @property {string} type - 课程类型, 选修 / 必修等
 * @property {number} credit - 学分
 * @property {string} extra - 额外信息
 * @property {string} area - 校区
 * @property {number} people - 人数
 * @property {string} teacher - 教师
 */
export interface ExtraCourseItem {
  course_id: string
  course_name: string
  class_name: string
  type: string
  credit: number
  extra: string
  area: string
  people: number
  teacher: string
}

/**
 * @description 自定义课程请求体
 * @property {string} course_name - 课程名称
 * @property {number[]} weeks - 周次
 * @property {number} day - 课程日, 从 0 开始, 0 表示周日
 * @property {number[]} times - 节次, 1 - 12
 * @property {string} place - 地点
 * @property {string} teacher - 教师
 */
export interface CustomCourseRequest {
  course_name: string
  weeks: number[]
  day: number
  times: number[]
  place: string
  teacher: string
}

/**
 * @description 获取全部课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465962383
 */
export type CourseGetRequest = Semester

/**
 * @description 获取全部课程响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465962383
 */
export type CourseGetResponse = CourseItem[]

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
export type CoursePostRequest = Semester & CustomCourseRequest

/**
 * @description 添加自定义课程响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465968797
 */
export type CoursePostResponse = CourseItem[]

/**
 * @description 编辑自定义课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465969451
 */
export type CoursePutRequest = Semester & CustomCourseRequest

/**
 * @description 编辑自定义课程响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465969451
 */
export type CoursePutResponse = CourseItem[]

/**
 * @description 删除自定义课程请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465970608
 */
export type CourseDeleteRequest = Semester

/**
 * @description 删除自定义课程响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465970608
 */
export type CourseDeleteResponse = CourseItem[]
