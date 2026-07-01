import type { Semester } from "@/types/semester"

/**
 * @description 课表项，一个课表项对应于课表界面的一个格子的信息
 * @property {string} course_name - 课程名称
 * @property {string | null} course_id - 课程代码。对于自定义课程，该字段为 NULL
 * @property {string | null} class_name - 上课班级。对于自定义课程，该字段为 NULL
 * @property {string | null} course_type - 课程类型, 如通识必修、专业选修
 * @property {number | null} credit - 学分, 自定义课程为 NULL
 * @property {number[]} weeks - 上课周次
 * @property {number} day - 周几上课, 周日为 0, 周一为 1
 * @property {number} time - 上课节次, 1 到 12
 * @property {string | null} extra - 额外备注信息, 自定义课程为 NULL
 * @property {string | null} area - 校区, 自定义课程为 NULL
 * @property {string | null} place - 地点
 * @property {number | null} people - 人数, 自定义课程为 NULL
 * @property {string | null} teacher - 教师
 * @property {number | null} customize_id - 自定义课程 id, 非自定义课程为 NULL
 * @see https://app.apifox.com/link/project/8311217/apis/api-465962383
 */
export interface ClasstableItem {
  course_name: string
  course_id: string | null
  class_name: string | null
  course_type: string | null
  credit: number | null
  weeks: number[]
  day: number
  time: number
  extra: string | null
  area: string | null
  place: string | null
  people: number | null
  teacher: string | null
  customize_id: number | null
}

/**
 * @description 获取课表请求数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465962383
 */
export type ClasstableGetRequest = Semester

/**
 * @description 获取课表响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-465962383
 */
export type ClasstableGetResponse = ClasstableItem[]
