/**
 * @description 日志标签配置
 */
export const LABEL = {
  lib: {
    request: {
      NETWORK_ERROR: "Network Error",
      SERVER_ERROR: "Server Error",
    },
    storage: {
      GET_ERROR: "Storage Get Error",
      SET_ERROR: "Storage Set Error",
      EXPIRED: "Storage Expired",
    },
  },
  util: {
    auth_request: "Auth Request",
    parse_sex: "Parse Sex",
  },
  hook: {
    request: {
      REQUEST_HOOK_ERROR: "Request Hook Error",
    },
    setting: {
      FETCH_ERROR: "Setting Fetch Error",
      UPDATE_ERROR: "Setting Update Error",
    },
  },
  page: {
    table: {
      custom: {
        INVALID_INDEX: "Custom Course Invalid Index",
      },
      options: {
        SEMESTER_NOT_ACCESSIBLE: "Table Options Semester Not Accessible",
      },
    },
  },
}
