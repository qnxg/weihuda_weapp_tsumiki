/**
 * @interface AuthLoginRequest - 登录请求(刷新 refresh_token)
 * @property {string} code - wx login code
 * @property {string} stu_id - 学号
 * @property {string} password - 密码 (公钥 RSA 加密)
 * @property {string} pow_ticket - 工作量证明 ticket
 * @property {number} pow_answer - 工作量证明答案
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginRequest {
  code: string
  stu_id: string
  password: string
  pow_ticket: string
  pow_answer: number
}

/**
 * @interface AuthLoginResponse - 登录响应
 * @property {string} refresh_token - 刷新令牌
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746340
 */
export interface AuthLoginResponse {
  refresh_token: string
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
 * @see https://app.apifox.com/link/project/8311217/apis/api-461746813
 */
export interface AuthRefreshResponse {
  access_token: string
}

/**
 * @interface AuthTFAResquest - 提交 tfa 认证请求
 * @property {string} code - 验证码
 * @see https://app.apifox.com/link/project/8311217/apis/api-461750066
 */
export interface AuthTFAResquest {
  code: string
}

/**
 * @interface AuthPowRequest - 工作量证明请求
 * @property {string} stu_id - 学号
 * @see https://app.apifox.com/link/project/8311217/apis/api-462316739
 */
export interface AuthPowRequest {
  stu_id: string
}

/**
 * @interface AuthPowResponse - 工作量证明响应
 * @property {string} ticket - 工作量证明 ticket
 * @property {number} difficulty - 工作量证明难度
 * @see https://app.apifox.com/link/project/8311217/apis/api-462316739
 */
export interface AuthPowResponse {
  ticket: string
  difficulty: number
}
