import type { UserInfo } from "@/types/auth"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/apis"
import { useAuthContext } from "@/contexts/auth"
import { unlockAuthPrompts } from "@/libs/auth-bridge"
import { navigate } from "@/utils/navigate"
import { parseSex } from "@/utils/parse-sex"

const AUTH_PAGE = "/pages/auth/index"

/**
 * @property {UserInfo | null} user - 当前用户信息, 未登录或未加载时为 null
 * @property {boolean} isLoading - 用户信息是否正在加载
 * @property {() => Promise<UserInfo | null>} updateUser - 重新获取用户信息并更新 state, 返回用户信息
 * @property {() => void} clearUser - 清除用户信息并跳转登录页
 * @property {() => void} unlockPrompts - 解锁鉴权弹窗会话锁, 供下拉刷新 / 鉴权成功调用
 */
export interface AuthHookResult {
  user: UserInfo | null
  isLoading: boolean
  updateUser: () => Promise<UserInfo | null>
  clearUser: () => void
  unlockPrompts: () => void
}

/**
 * @description 用户信息 Hook
 */
export function useAuth(): AuthHookResult {
  const { user, setUser } = useAuthContext()
  const [isLoading, setIsLoading] = useState(() => user === null)

  const updateUser = useCallback(async () => {
    setIsLoading(true)
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
      .finally(() => setIsLoading(false))
  }, [setUser])

  useEffect(() => {
    if (user === null) {
      void updateUser()
    }
    else {
      setIsLoading(false)
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
    isLoading,
    updateUser,
    clearUser,
    unlockPrompts,
  }
}
