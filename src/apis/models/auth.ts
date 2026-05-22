/**
 * @interface AuthLoginRequest - 登录请求(刷新 refresh_token)
 * @property {string} code - wx login code
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginRequest {
  code: string
}

/**
 * @interface AuthLoginResponse - 登录响应
 * @property {string} access_token - 访问令牌
 * @property {string} refresh_token - 刷新令牌
 * @property {number} expires_in - 访问令牌过期时间, 单位为秒
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * @interface AuthRefreshRequest - 刷新令牌请求
 * @property {string} refresh_token - 刷新令牌
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746813
 */
export interface AuthRefreshRequest {
  refresh_token: string
}

/**
 * @interface AuthRefreshResponse - 刷新令牌响应
 * @property {string} access_token - 新的访问令牌
 * @property {string} refresh_token - 新的刷新令牌
 * @property {number} expires_in - 新的访问令牌过期时间, 单位为秒
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746813
 */
export interface AuthRefreshResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * @interface AuthBindRequest - 绑定 cas 请求
 * @property {string} stu_id - 学号
 * @property {string} password - 密码
 * @see https://app.apifox.com/link/project/8311217/apis/api-461749065
 */
export interface AuthBindRequest {
  stu_id: string
  password: string
}

/**
 * @interface AuthTFAGetResponse - 触发 tfa 认证请求
 * @property {string} phone - 认证手机号
 * @see https://app.apifox.com/link/project/8311217/apis/api-461749814
 */
export interface AuthTFAGetResponse {
  phone: string
}

/**
 * @interface AuthTFAPostResquest - 提交 tfa 认证请求
 * @property {string} code - 验证码
 * @see https://app.apifox.com/link/project/8311217/apis/api-461750066
 */
export interface AuthTFAPostResquest {
  code: string
}
