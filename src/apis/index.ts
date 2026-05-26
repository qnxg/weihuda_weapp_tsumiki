import type { AnnouncementResponse } from "@/apis/models/announcement"
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthPowRequest,
  AuthPowResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthTFAResquest,
} from "@/apis/models/auth"
import type { MeResponse } from "@/apis/models/me"
import { request } from "@/utils/auth-request"

export const api = {
  base: () => request.get<{ hello: string }>("/"),
  auth: {
    login: (data: AuthLoginRequest) => request.get<AuthLoginResponse>("/auth/login", data),
    refresh: (data: AuthRefreshRequest) => request.get<AuthRefreshResponse>("/auth/refresh", data),
    tfa: {
      get: () => request.get("/auth/tfa"),
      post: (data: AuthTFAResquest) => request.post("/auth/tfa", data),
    },
    unbind: () => request.get("/auth/unbind"),
    pow: (data: AuthPowRequest) => request.get<AuthPowResponse>("/auth/pow", data),
  },
  me: () => request.get<MeResponse>("/me"),
  announcement: () => request.get<AnnouncementResponse>("/announcement"),
}
