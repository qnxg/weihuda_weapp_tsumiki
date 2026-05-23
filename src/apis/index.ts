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
import { authRequest } from "@/utils/auth-request"

export const api = {
  base: () => authRequest.get<{ hello: string }>("/"),
  auth: {
    login: (data: AuthLoginRequest) => authRequest.get<AuthLoginResponse>("/auth/login", data),
    refresh: (data: AuthRefreshRequest) => authRequest.get<AuthRefreshResponse>("/auth/refresh", data),
    tfa: {
      get: () => authRequest.get("/auth/tfa"),
      post: (data: AuthTFAResquest) => authRequest.post("/auth/tfa", data),
    },
    unbind: () => authRequest.get("/auth/unbind"),
    pow: (data: AuthPowRequest) => authRequest.get<AuthPowResponse>("/auth/pow", data),
  },
  me: () => authRequest.get<MeResponse>("/me"),
  announcement: () => authRequest.get<AnnouncementResponse>("/announcement"),
}
