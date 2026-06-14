/**
 * @description 排名详情
 * @property {string} arithmetic - 算数平均成绩
 * @property {string} arithmetic_rank - 算数平均成绩排名，格式为 排名/总人数
 * @property {string} weighted - 加权平均成绩
 * @property {string} weighted_rank - 加权平均成绩排名，格式为 排名/总人数
 * @property {string} gpa - 绩点
 * @property {string} gpa_rank - 绩点排名，格式为 排名/总人数
 */
export interface RankDetail {
  arithmetic: string | null
  arithmetic_rank: string | null
  weighted: string | null
  weighted_rank: string | null
  gpa: string | null
  gpa_rank: string | null
}

/**
 * @description 排名结构
 * @property {RankDetail} all - 全部课程，为 null 说明暂无数据
 * @property {RankDetail} compulsory - 必修课程，为 null 说明暂无数据
 * @property {RankDetail} core - 核心课程，为 null 说明暂无数据
 */
export interface Rank {
  all: RankDetail | null
  compulsory: RankDetail | null
  core: RankDetail | null
}

/**
 * @description 从可信电子凭证获取排名响应数据
 * @property {string} updated_at - 最后更新时间
 * @property {Rank} rank - 排名信息
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582587
 */
export interface RankCaResponse {
  updated_at: string
  rank: Rank
}

/**
 * @description 从教务系统获取排名响应数据
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582587
 */
export type RankResponse = Rank

/**
 * @description 从教务系统获取排名请求数据
 * @property {number} [xn] - 学年，为学年的起始年份，空则返回全部学年
 * @property {string} [xq] - 学期枚举值，空则返回当前学年的全部学期，不支持 winter
 * @property {string} range - 课程范围
 * @property {string} data_source - 数据来源
 * @property {string} display - 显示方式
 * @see https://app.apifox.com/link/project/8311217/apis/api-472582587
 */
export interface RankRequest {
  xn?: number
  xq?: "autumn" | "spring" | "summer"
  range: string
  data_source: string
  display: string
}
