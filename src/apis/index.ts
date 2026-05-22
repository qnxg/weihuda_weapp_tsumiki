import type {
  AuthBindRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthTFAGetResponse,
  AuthTFAPostResquest,
} from "@/apis/models/auth"
import type { MeResponse } from "@/apis/models/me"
import { request } from "@/utils/request"

export const api = {
  base: () => request.get<{ hello: string }>("/"),
  auth: {
    login: (data: AuthLoginRequest) => request.get<AuthLoginResponse>("/auth/login", data),
    refresh: (data: AuthRefreshRequest) => request.get<AuthRefreshResponse>("/auth/refresh", data),
    bind: (data: AuthBindRequest) => request.post("/auth/bind", data),
    tfa: {
      get: () => request.get<AuthTFAGetResponse>("/auth/tfa"),
      post: (data: AuthTFAPostResquest) => request.post("/auth/tfa", data),
      sms: () => request.get("/auth/tfa/sms"),
    },
  },
  me: () => request.get<MeResponse>("/me"),
}
