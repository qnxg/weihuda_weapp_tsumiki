import type { UserInfo } from "@/types/user"
import { useCallback, useEffect } from "react"
import { api } from "@/apis"
import { useUserContext } from "@/contexts/user"
import { navigate } from "@/utils/navigate"
import { parseSex } from "@/utils/parse-sex"

const LOGIN_PAGE = "/pages/login/index"

/**
 * @property {UserInfo | null} user - 当前用户信息, 未登录或未加载时为 null
 * @property {() => Promise<UserInfo | null>} updateUser - 重新获取用户信息并更新 state, 返回用户信息
 * @property {() => void} clearUser - 清除用户信息并跳转登录页
 */
export interface UserHookResult {
  user: UserInfo | null
  updateUser: () => Promise<UserInfo | null>
  clearUser: () => void
}

/**
 * @description 用户信息 Hook
 */
export function useUser(): UserHookResult {
  const { user, setUser } = useUserContext()

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
    navigate(LOGIN_PAGE)
  }, [setUser])

  return {
    user,
    updateUser,
    clearUser,
  }
}
