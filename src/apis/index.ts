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
import type {
  IndexCardSettingRequestData,
  MeResponse,
  MeSettingResponse,
  TableSettingRequestData,
} from "@/apis/models/me"
import type { Semester, SemesterInfo } from "@/types/semester"
import { request } from "@/libs/auth-request"

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
  me: {
    get: () => request.get<MeResponse>("/me"),
    setting: {
      get: () => request.get<MeSettingResponse>("/me/setting"),
      getIndexCard: () => request.get<IndexCardSettingRequestData>("/me/setting/index_card_setting"),
      getTable: () => request.get<TableSettingRequestData>("/me/setting/table_setting"),
      putIndexCard: (data: IndexCardSettingRequestData) => request.put<IndexCardSettingRequestData>("/me/setting/index_card_setting", data),
      putTable: (data: TableSettingRequestData) => request.put<TableSettingRequestData>("/me/setting/table_setting", data),
    },
  },
  announcement: () => request.get<AnnouncementResponse>("/announcement"),
  semester: (data?: Semester) => request.get<SemesterInfo>("/semster", data),
}
