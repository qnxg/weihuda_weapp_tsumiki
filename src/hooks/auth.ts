import type { UserInfo } from "@/types/auth"
import { useCallback, useEffect } from "react"
import { api } from "@/apis"
import { useAuthContext } from "@/contexts/auth"
import { unlockAuthPrompts } from "@/libs/auth-bridge"
import { navigate } from "@/utils/navigate"
import { parseSex } from "@/utils/parse-sex"

const AUTH_PAGE = "/pages/auth/index"

/**
 * @property {UserInfo | null} user - 当前用户信息, 未登录或未加载时为 null
 * @property {() => Promise<UserInfo | null>} updateUser - 重新获取用户信息并更新 state, 返回用户信息
 * @property {() => void} clearUser - 清除用户信息并跳转登录页
 * @property {() => void} unlockPrompts - 解锁鉴权弹窗会话锁, 供下拉刷新 / 鉴权成功调用
 */
export interface AuthHookResult {
  user: UserInfo | null
  updateUser: () => Promise<UserInfo | null>
  clearUser: () => void
  unlockPrompts: () => void
}

/**
 * @description 用户信息 Hook
 */
export function useAuth(): AuthHookResult {
  const { user, setUser } = useAuthContext()

  const updateUser = useCallback(async () => {
    return api.me.get()
      .then((res) => {
        const data = res.data
        const userInfo: UserInfo = {
          name: data.name,
          sex: parseSex(data.sex),
          enter: data.enter,
          stu_id: data.stu_id,
        }
        setUser(userInfo)
        return userInfo
      })
      .catch(() => null)
  }, [setUser])

  useEffect(() => {
    if (user === null) {
      void updateUser()
    }
  }, [setUser, updateUser, user])

  const clearUser = useCallback(() => {
    setUser(null)
    navigate(AUTH_PAGE)
  }, [setUser])

  const unlockPrompts = useCallback(() => {
    unlockAuthPrompts()
  }, [])

  return {
    user,
    updateUser,
    clearUser,
    unlockPrompts,
  }
}
