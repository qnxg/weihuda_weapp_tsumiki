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
import { authRequest } from "@/utils/auth-request"

export const api = {
  base: () => authRequest.get<{ hello: string }>("/"),
  auth: {
    login: (data: AuthLoginRequest) => authRequest.get<AuthLoginResponse>("/auth/login", data),
    refresh: (data: AuthRefreshRequest) => authRequest.get<AuthRefreshResponse>("/auth/refresh", data),
    bind: (data: AuthBindRequest) => authRequest.post("/auth/bind", data),
    tfa: {
      get: () => authRequest.get<AuthTFAGetResponse>("/auth/tfa"),
      post: (data: AuthTFAPostResquest) => authRequest.post("/auth/tfa", data),
      sms: () => authRequest.get("/auth/tfa/sms"),
    },
  },
  me: () => authRequest.get<MeResponse>("/me"),
}
