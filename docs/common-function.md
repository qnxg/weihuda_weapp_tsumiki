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

- Checkbox 组件 `/checkbox`: checkbox 样式的多选条目
  - `Checkbox`: 左侧方框指示选中态, 支持 label / description

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

- 带鉴权的请求函数 `/libs/auth-request.ts`: 基于通用请求函数封装, 自动携带鉴权头并拦截 401, 分发到 `utils/auth.ts` 处理; 对外仍暴露 `request` (提供 get/post/put/delete 快捷方法)
  - 与 `libs/request.ts` (底层请求) 和 `utils/auth.ts` (鉴权处理) 构成三层请求体系

- 鉴权处理函数 `/utils/auth.ts`: 承载 token 存储与 401 恢复逻辑, 供 `auth-request.ts` 调用
  - `accessTokenStorage` / `refreshTokenStorage`: 两个 token 的存储实例
  - `refreshAccessToken`: 单飞刷新 access_token, 并发 401 只发起一次 `/auth/refresh`, 失败返回 null
  - `handleLoginLost`: token 失效时先静默刷新并透明重试原请求, 刷新失败则引导登录
  - `handleTFA`: 需要双因子认证时引导前往验证码页
  - `clearTokens`: 清除本地 token, 用于登出 / 登录丢失

- 鉴权弹窗桥接函数 `/libs/auth-bridge.ts`: 解耦请求层与页面导航, 提供鉴权引导弹窗
  - `promptLoginLost` / `promptTFA`: 弹窗引导前往登录 / 验证码页, 各自带会话锁去重, 已上锁则静默跳过
  - `unlockAuthPrompts`: 解锁两把会话锁, 供下拉刷新 / 鉴权成功等用户主动动作调用

- 类名拼接函数 `/utils/cn.ts`: shadcn 风格的 className 合并函数
  - 详见 [GitHub - lukeed/clsx](https://github.com/lukeed/clsx)

- 时间处理函数 `/utils/ohday.ts`: 基于自研日期库 @twisuki/ohday 的日期时间处理函数, 提供全局单例 od 实例
  - `od` 对象是全局的, 支持多种输入方式, 链式调用, 不可变操作, 同时原生支持自定义格式解析
  - 所有日期时间状态统一使用 `od().s` 的标准字符串格式存储, 初始化时通过 `.cs()` 填充缺省字段, 可保证解析简单
  - 详见 [npm - @twisuki/ohday](https://npmjs.com/package/@twisuki/ohday)

- 通用导航函数 `/utils/navigate.ts`: 自动区分普通页面和 tab 页面进行导航
  - 详见 [Taro - navigateTo](https://docs.taro.zone/docs/apis/route/navigateTo)

- 通用弹窗函数 `/utils/modal.ts`: 基于 Taro.showModal 封装的确认框函数
  - 支持 Promise 和回调两种调用方式
  - `type` 参数: `"default"` 使用 primary 色 (#328ccb), `"dangerous"` 使用红色 (#ff5555)
  - Promise 方式: `const res = await showModal(title, content, type)`, 返回 `boolean` 表示是否确认
  - 回调方式: `showModal(title, content, type, onConfirm, onCancel)`, 无返回值

- 通用存储类 `/utils/storage.ts`: 基于 Taro storage 封装的存储类, 支持过期机制, 提供 get/set/remove 方法
  - 并暴露 clearAllStorage 函数安全清除缓存(保留 token)
  - 以及 clearStorageByPrefix 函数按前缀清除某一类带动态后缀的缓存

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

- 请求钩子 `/hooks/request/`: TanStack Query 风格的自研请求 hook 体系
  - `useQuery(fn, deps, options)`: 实例级取数 hook
    - 接收 `取数函数` (返回 `Promise<Response<T>>`) / `依赖数组` (变更触发 refetch) / `配置项` (`enabled` / `initialData` / `placeholderData` / `onSuccess` / `onError` / `onSettled`)
    - 返回 `data` / `error` / `status` (`pending` / `error` / `success`) / `fetchStatus` (`fetching` / `idle`) / `refetch`
    - 实例级独立, 不做跨实例去重 / 缓存共享 / 失效
  - `useMutation(fn, options)`: 实例级变更 hook
    - 接收 `mutation 函数` / `配置项` (`onMutate` / `onSuccess` / `onError` / `onSettled`)
    - 返回 `mutate(vars, callbacks)` / `mutateAsync(vars)` / `isPending` / `isError` / `isSuccess` / `reset`
    - 同实例 `mutate` 串行执行, 实例级独立, 无失效机制
  - `useCachedQuery(fn, deps, key, options)`: 实例级取数 hook, 内部基于 `useQuery` 加 wx.storage 持久化
    - 接收 `取数函数` / `依赖数组` / `storage key` / `配置项`
    - 返回 `data` / `status` (`CachedQueryStatus`, 扩展 `QueryStatus` 多 `waiting` / `updating` / `cached` 三态) / `refetch`
    - status 三态扩展用于描述 storage 加载占位 / 写中状态 / 失败兜底场景

- 存储钩子 `/hooks/storage.ts`: 对通用存储类 `/utils/storage.ts` 中各个 Promise 的封装
  - 接收存储键, 返回 `存储值` / `错误` / `加载状态` 等, 同时提供 `set` / `remove` 方法

- 课程钩子 `hooks/course.ts`: 课程数据请求钩子
  - 基于 `useCachedQuery` 封装, 兼容学期未就绪的情况
  - `useCourse`: 课表课程钩子
  - `useExtraCourse`: 无课表课程钩子

- 成绩钩子 `hooks/grade.ts`: 成绩数据请求钩子
  - 基于 `useQuery` 封装, 兼容学期未就绪的情况

## 全局状态共享相关函数

此类复杂功能需要 `context` 与 `hook` 相配合, 详见 [状态管理](./state-manager.md)

### 鉴权 auth

- context: `/contexts/auth.tsx`
- hook: `/hooks/auth.ts`
- type: `/types/auth.ts`
- 其他工具函数: `utils/parse-sex.ts`, `utils/auth.ts`, `libs/auth-bridge.ts`

用于获取并全局共享用户信息, mount 时获取一次用户信息, 并提供 `更新信息` 和 `删除用户` 的方法; hook 暴露 `isLoading` 表示用户信息是否正在加载

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

### 首页卡片加载 card-loading

- context: `/pages/index/contexts/card-loading.tsx`
- hook: `/pages/index/hooks/card-loading.ts`

首页下拉刷新通知所有卡片协作机制. 卡片通过 `useEffect` 注册自己的 refetch 函数 (卸载时 cleanup 注销), `triggerRefresh` 异步等待全部完成, 单卡片失败不影响整体
