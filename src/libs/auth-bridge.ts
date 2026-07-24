import { showModal } from "@/utils/modal"
import { navigate } from "@/utils/navigate"

const AUTH_PAGE = "/pages/auth/index"
const TFA_PAGE = "/pages/auth/index?tab=tfa"

/**
 * @description 登录丢失弹窗会话锁
 */
let loginLostLocked = false

/**
 * @description TFA 弹窗会话锁
 */
let tfaLocked = false

/**
 * @description 提示登录已丢失, 引导前往登录. 已上锁则静默跳过 (不重复弹窗)
 */
export function promptLoginLost(): void {
  if (loginLostLocked) {
    return
  }
  loginLostLocked = true

  void showModal(
    "登录已过期",
    "登录状态已失效, 是否前往登录?",
    "default",
    () => navigate(AUTH_PAGE),
  )
}

/**
 * @description 提示需要双因子认证, 引导前往验证码页. 已上锁则静默跳过
 * @param {string} phone - 401 TFA 下发的手机号, 透传至验证码页只读展示
 */
export function promptTFA(phone: string): void {
  if (tfaLocked) {
    return
  }
  tfaLocked = true

  const url = `${TFA_PAGE}&phone=${encodeURIComponent(phone)}`

  void showModal(
    "需要验证",
    "该操作需要双因子认证, 是否前往验证?",
    "default",
    () => navigate(url),
  )
}

/**
 * @description 解锁两把会话锁, 允许下次失效再次弹窗
 * 供下拉刷新 / 鉴权成功等用户主动动作调用; 解锁不主动重弹
 */
export function unlockAuthPrompts(): void {
  loginLostLocked = false
  tfaLocked = false
}
