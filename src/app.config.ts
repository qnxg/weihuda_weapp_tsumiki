export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/toolkit/index",
    "pages/table/index",
    "pages/profile/index",
    // 非 tab 页
    "pages/login/index",
    "pages/feedback/index",
    "pages/faq/index",
    "pages/disclaimers/index",
    "pages/message/index",
  ],
  subPackages: [
    {
      root: "tools",
      pages: [
        "pages/grade/grade/index",
        "pages/grade/ranking/index",
        "pages/grade/experiment-grade/index",
        "pages/grade/physical-grade/index",
        "pages/exam/experiment-arrange/index",
        "pages/exam/exam-arrange/index",
        "pages/exam/physical-appoint/index",
        "pages/exam/custom-exam/index",
        "pages/campus/calender/index",
        "pages/campus/physical-standard/index",
        "pages/campus/empty-room/index",
        "pages/campus/card-bill/index",
        "pages/campus/netflow-bill/index",
        "pages/campus/netflow-detail/index",
        "pages/campus/electricity/index",
      ],
    },
    {
      root: "setting",
      pages: [
        "pages/index-card/index",
        "pages/lab-bind/index",
        "pages/class-table/index",
      ],
    },
  ],
  darkmode: true,
  themeLocation: "theme.json",
  window: {
    navigationBarTitleText: "湖南大学微生活",
    navigationBarBackgroundColor: "@navBgColor",
    navigationBarTextStyle: "@navTextStyle",
    backgroundColor: "@bgColor",
    backgroundTextStyle: "@bgTextStyle",
    backgroundColorTop: "@bgColorTop",
    backgroundColorBottom: "@bgColorBottom",
  },
  tabBar: {
    color: "@tabFontColor",
    selectedColor: "@tabSelectedColor",
    backgroundColor: "@tabBgColor",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/toolkit/index",
        text: "工具箱",
      },
      {
        pagePath: "pages/table/index",
        text: "课表",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
      },
    ],
  },
})
