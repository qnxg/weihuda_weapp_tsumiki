/**
 * @description 登录和 cas 绑定请求(刷新 refresh_token)
 * @property {string} code - wx login code
 * @property {string} stu_id - 学号
 * @property {string} password - 密码 (base64 加密)
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginRequest {
  code: string
  stu_id: string
  password: string
}

/**
 * @description 登录响应
 * @property {string} refresh_token - 刷新令牌
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginResponse {
  refresh_token: string
}

/**
 * @description 刷新令牌请求
 * @property {string} refresh_token - 刷新令牌
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746813
 */
export interface AuthRefreshRequest {
  refresh_token: string
}

/**
 * @description 刷新令牌响应
 * @property {string} access_token - 新的访问令牌
 * @property {string} refresh_token - 新的刷新令牌
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746813
 */
export interface AuthRefreshResponse {
  access_token: string
  refresh_token: string
}

/**
 * @description 提交 tfa 认证请求
 * @property {string} code - 验证码
 * @see https://app.apifox.com/link/project/8311217/apis/api-461750066
 */
export interface AuthTFARequest {
  code: string
}

/**
 * @description 401 code:"TFA" 错误携带的数据
 * @property {string} phone - 11 位手机号 (字符串), 中间四位可能为 ****
 */
export interface AuthTFAErrorData {
  phone: string
}
