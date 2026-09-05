/**
 * @description 关于页信息响应
 * @property {string} home - 官网链接
 * @property {string} join - 招新链接
 * @property {string} version - 当前版本号
 * @property {string[]} slogans - 标语列表
 * @see https://app.apifox.com/link/project/8311217/apis/api-507074934
 */
export interface AboutResponse {
  home: string
  join: string
  version: string
  slogans: string[]
}
