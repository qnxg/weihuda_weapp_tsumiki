/**
 * @description 宿舍信息响应
 * @property {string} park - 园区
 * @property {string} build - 楼栋
 * @property {string} room - 房间号
 * @see https://app.apifox.com/link/project/8311217/apis/api-471051526
 */
export interface DormResponse {
  park: string
  build: string
  room: string
}

/**
 * @description 电量信息响应
 * @property {string} balance - 电量余额
 * @see https://app.apifox.com/link/project/8311217/apis/api-471053086
 */
export interface ElectricityResponse {
  balance: string
}
