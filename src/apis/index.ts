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

import type { CardInfoResponse, CardRecordRequest, CardRecordResponse } from "@/apis/models/card"
import type {
  CourseDeleteRequest,
  CourseGetExtraRequest,
  CourseGetExtraResponse,
  CourseGetRequest,
  CourseGetResponse,
  CoursePostRequest,
  CoursePostResponse,
  CoursePutRequest,
  CoursePutResponse,
} from "@/apis/models/course"
import type { DormResponse, ElectricityResponse } from "@/apis/models/electricity"
import type { EmailResponse } from "@/apis/models/email"
import type {
  ExamPostRequest,
  ExamPutRequest,
  ExamResponse,
} from "@/apis/models/exam"
import type {
  FeedbackGetRequest,
  FeedbackGetResponse,
  FeedbackNoAuthRequest,
  FeedbackPostRequest,
  FeedbackPostResponse,
} from "@/apis/models/feedback"
import type {
  GradeDetailResponse,
  GradeRequest,
  GradeResponse,
} from "@/apis/models/grade"
import type {
  GymAppointmentResponse,
  GymGradeRequest,
  GymGradeResponse,
} from "@/apis/models/gym"
import type {
  JifenGetDescResponse,
  JifenGetGoodsResponse,
  JifenGetRecordRequest,
  JifenGetRecordResponse,
  JifenGetResponse,
} from "@/apis/models/jifen"
import type { IndexCardSettingRequestData, MeResponse, MeSettingResponse, TableSettingRequestData } from "@/apis/models/me"
import type {
  MonthNetflowResponse,
  NetflowDetailRequest,
  NetflowDetailResponse,
  NetflowOrderResponse,
} from "@/apis/models/netflow"
import type {
  RankCaResponse,
  RankRequest,
  RankResponse,
} from "@/apis/models/rank"
import type { SemesterRequest, SemesterResponse } from "@/apis/models/semester"
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
  semester: (data?: SemesterRequest) => request.get<SemesterResponse>("/semester", data),
  course: {
    get: (data: CourseGetRequest) => request.get<CourseGetResponse>("/course", data),
    getExtra: (data: CourseGetExtraRequest) => request.get<CourseGetExtraResponse>("/course/extra", data),
    post: (data: CoursePostRequest) => request.post<CoursePostResponse>("/course", data),
    put: (customize_id: number, data: CoursePutRequest) => request.put<CoursePutResponse>(`/course/${customize_id}`, data),
    delete: (customize_id: number, data: CourseDeleteRequest) => request.delete(`/course/${customize_id}`, data),
  },
  jifen: {
    get: () => request.get<JifenGetResponse>("/jifen"),
    post: () => request.post("/jifen"),
    getRecord: (data: JifenGetRecordRequest) => request.get<JifenGetRecordResponse>("/jifen/record", data),
    getGoods: () => request.get<JifenGetGoodsResponse>("/jifen/goods"),
    postGoods: (id: number) => request.post(`/jifen/goods/${id}`),
    getDesc: () => request.get<JifenGetDescResponse>("/jifen/desc"),
  },
  rank: {
    ca: {
      get: () => request.get<RankCaResponse>("/rank/ca"),
      put: () => request.put("/rank/ca"),
    },
    get: (data: RankRequest) => request.get<RankResponse>("/rank", data),
  },
  email: {
    get: () => request.get<EmailResponse>("/email"),
  },
  card: {
    info: () => request.get<CardInfoResponse>("/card/info"),
    record: (data: CardRecordRequest) => request.get<CardRecordResponse>("/card/record", data),
  },
  dorm: {
    get: () => request.get<DormResponse>("/dorm"),
    put: () => request.put("/dorm"),
  },
  electricity: {
    get: () => request.get<ElectricityResponse>("/dorm/electricity"),
    put: () => request.put("/dorm/electricity"),
  },
  grade: {
    get: (data: GradeRequest) => request.get<GradeResponse>("/grade", data),
    getDetail: (jx0404id: string) => request.get<GradeDetailResponse>(`/grade/${jx0404id}`),
  },
  netflow: {
    get: () => request.get<MonthNetflowResponse>("/netflow"),
    getOrder: () => request.get<NetflowOrderResponse>("/netflow/order"),
    getDetail: (data: NetflowDetailRequest) => request.get<NetflowDetailResponse>("/netflow/detail", data),
  },
  exam: {
    get: () => request.get<ExamResponse>("/exam"),
    post: (data: ExamPostRequest) => request.post("/exam", data),
    put: (customize_id: number, data: ExamPutRequest) => request.put(`/exam/${customize_id}`, data),
    delete: (customize_id: number) => request.delete(`/exam/${customize_id}`),
  },
  feedback: {
    get: (data?: FeedbackGetRequest) => request.get<FeedbackGetResponse>("/feedback", data),
    post: (data: FeedbackPostRequest) => request.post<FeedbackPostResponse>("/feedback", data),
    postNoAuth: (data: FeedbackNoAuthRequest) => request.post("/feedback/no_auth", data),
  },
  gym: {
    grade: (data?: GymGradeRequest) => request.get<GymGradeResponse>("/gym/grade", data),
    appointment: () => request.get<GymAppointmentResponse>("/gym/appointment"),
  },
}
