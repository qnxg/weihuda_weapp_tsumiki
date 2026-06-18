# 通用函数

## 通用组件

通用组件位于 `src/compoents/` 下, 当前定义组件有:

- 卡片组件 `/card`: 页面最基础的构建部分之一
  - `Card`: 基础卡片容器
  - `CardHeader`: 卡片头部组件
  - `CardIcon`: 卡片头部的图标组件
  - `CardTitle`: 卡片头部的标题组件
  - `CardAction`: 卡片头部的操作组件, 包含内容和触发/跳转信息
  - `CardContent`: 卡片内容组件

- 图标组件 `/icon`: 用于加载和显示图标资源
  - `Icon`: 图标组件, 支持 light/dark/auto 主题模式

- 按钮组件 `/my-button`: 带简单样式和原生按钮功能的自定义按钮组件
  - `MyButton`: 自定义按钮组件, 支持导航跳转或点击事件, 同时支持表单和微信原生能力, 可通过 active 状态控制样式

- 操作列表组件 `/options`: 操作列表容器
  - `Option`: 单个操作选项组件
  - `Options`: 操作列表容器组件, 支持 divided/underline/wrapped/plain 四种样式类型

- 遮罩组件 `/overlay`: 全屏遮罩层组件
  - `Overlay`: 遮罩层组件, 全屏 fixed 定位
  - `OverlayMask`: 带遮罩内容展示组件, 支持 loading 状态和 top/center/bottom 三种定位模式
  - `Popup`: 底部弹出式弹窗组件, 集成 Overlay + OverlayMask + ScrollView, 支持滑入动画

- 页面容器组件 `/page`: 页面基本布局组件
  - `Page`: 页面容器组件, 提供基本布局样式, 支持 loading 状态
  - `PageContent`: 页面内容组件, 自动支持滚动(可禁用), 支持下拉刷新

- 下拉刷新组件 `/pull-refresh`: 下拉刷新组件
  - `PullRefresh`: 下拉刷新组件, 接收一个 Promise 作为刷新回调, 并在异步函数完成之后自动结束动画

- 骨架屏组件 `/skeleton`: 骨架屏组件
  - `Skeleton`: 骨架屏组件, 自动适配深色/浅色模式, 支持自定义样式

- 标签页组件 `/tabs`: Tab 选择组件
  - `Tabs`: 标签页容器组件, 支持受控和非受控模式, 提供 Context 传递选中状态
  - `TabList`: 标签页按钮列表容器组件
  - `TabTrigger`: 标签页选择触发按钮, 支持 asChild 自定义样式
  - `TabContent`: 标签页内容容器组件
  - `TabItem`: 标签页内容项, 根据 activeTab 匹配显示

## 通用普通函数

通用函数位于 `src/utils/` 和 `src/libs/` 下, 其中较复杂内容放置在 `src/libs/` 下, 简单内容放置在 `src/utils/` 下, 当前定义函数有:

- 通用请求函数 `/libs/request.ts`: 基于 Taro.request 封装, 自动拼接 BASE_URL, 支持请求/响应各阶段回调, 提供快捷请求方法
  - 本请求函数将分层处理错误, 对于网络错误和服务器错误, 直接记录日志, 不暴露给下一层处理; 仅正常的业务错误才会暴露
  - 本函数保证抛出的错误均为 `RequestError` 类型, 方便统一处理

- 带鉴权的请求函数 `/libs/auth-request.ts`: 基于通用请求函数封装, 自动处理鉴权相关逻辑, 如 token 携带, 401 错误处理等

- 类名拼接函数 `/utils/cn.ts`: shadcn 风格的 className 合并函数
  - 详见 [GitHub - lukeed/clsx](https://github.com/lukeed/clsx)

- 时间处理函数 `/utils/dayjs.ts`: 基于 dayjs 的时间处理函数, 全局安装了 customParseFormat 和 isBetween 插件
  - `dayjs` 对象是全局的, 因此一次插件安装, 整个进程可用, 尽管有些地方不需要使用插件, 但统一使用安装插件的 dayjs 不影响性能
  - 详见 [GitHub - iamkun/dayjs](https://github.com/iamkun/dayjs)

- 通用导航函数 `/utils/navigate.ts`: 自动区分普通页面和 tab 页面进行导航
  - 详见 [Taro - navigateTo](https://docs.taro.zone/docs/apis/route/navigateTo)

- 通用存储类 `/utils/storage.ts`: 基于 Taro storage 封装的存储类, 支持过期机制, 提供 get/set/remove 方法
  - 并暴露 clearAllStorage 函数安全清除缓存(保留 token)

- 主题获取函数 `/utils/theme.ts`: 获取当前主题, 返回 theme 和 isDark 计算属性
  - 注意: 在模拟器中直接切换主题, 该函数不会立即响应, 这是微信相关问题
  - 实际使用环境中, 主题切换必须重启整个微信, 因此不会出现该问题

- 性别解析函数 `/utils/parse-sex.ts`: 将各种性别字符串解析为 Sex 类型

- 学期处理函数 `/utils/semester.ts`: 提供部分学期和日期的处理能力
  - `getNextSemester` / `getPrevSemester`: 获取下一/上一学期标识符
  - `getSemesterDateInfo`: 获取学期日期相关信息(当前周次、已过天数、剩余天数、是否在学期内)
  - `getSemesterName` / `getSemesterFromName`: 学期名称与标识符互转

- 设置处理函数 `/utils/setting.ts`: 提供部分设置内容处理能力
  - `convertIndexCardSetting` / `convertTableSetting`: 转换 API 返回的设置格式为内部格式
  - `pickLatestSetting`: 根据 version 获取最新设置(支持 API/本地存储/默认配置三选一)

- 日志函数 `/utils/logger.ts`: 通用日志函数, 支持 debug/info/warn/error/fatal 五级日志
  - 虽然暂时无日志记录需求, 但本项目 linter 配置禁用了 `console.log` 的使用, 防止提交时误留调试日志, 因此提供了一个通用日志函数, 以便在必须记录时使用

- Mock 请求函数 `/utils/mock-request.ts`: 用于开发调试的模拟请求函数, 支持自定义延迟和错误概率

## 通用钩子函数

- 请求钩子 `/hooks/request.ts`: TanStack Query 风格的请求封装
  - 接收 `请求 Promise` / `依赖数组` / `配置项`, 返回 `数据` / `错误` / `加载状态` 等

- 存储钩子 `/hooks/storage.ts`: 对通用存储类 `/utils/storage.ts` 中各个 Promise 的封装
  - 接收存储键, 返回 `存储值` / `错误` / `加载状态` 等, 同时提供 `set` / `remove` 方法

- 带缓存的请求钩子 `/hooks/cached-request.ts`: 基于请求钩子封装, 自动缓存请求结果到通用存储类中
  - 接收 `请求 Promise` / `依赖数组` / `配置项`, 返回 `数据` / `错误` / `加载状态` 等, 同时提供手动刷新方法
  - 加载时, 先加载缓存中的数据(若有), 并并发的发送请求, 请求完成后更新数据和缓存, 请求失败则使用缓存数据兜底(若有), 二者均失效才报错

- 课程钩子 `hooks/course.ts`: 带缓存的课程数据请求钩子
  - 由于缓存请求 hook `useCachedRequest` 要求传入稳定的 `请求 Promise`, 但课程相关请求依赖学期参数, 本钩子兼容了学期未就绪的情况

- 成绩钩子 `hooks/grade.ts`: 成绩数据请求钩子
  - 同课程钩子, 兼容学期未就绪的情况

## 全局状态共享相关函数

此类复杂功能需要 `context` 与 `hook` 相配合, 详见 [状态管理](./state-manager.md)

### 用户信息 user

- context: `/contexts/user.tsx`
- hook: `/hooks/user.ts`
- type: `/types/user.ts`
- 其他工具函数: `utils/parse-sex.ts`

用于获取并全局共享用户信息, mount 时获取一次用户信息, 并提供 `更新信息` 和 `删除用户` 的方法

### 设置 setting

- context: `/contexts/setting.tsx`
- hook: `/hooks/setting.ts`
- type: `/types/setting.ts`
- 其他工具函数: `utils/setting.ts`

用于获取并全局共享用户设置, mount 时自动从服务器和本地存储读取设置, 取 version 最大的生效

分不同设置项提供更新函数, 会同步服务器和本地存储

### 学期信息 semester

- context: `/contexts/semester.tsx`
- hook: `/hooks/semester.ts`
- type: `/types/semester.ts`
- 其他工具函数: `utils/semester.ts`

用于获取并全局共享学期信息, mount 时自动请求指定学期信息并缓存当前学期信息
