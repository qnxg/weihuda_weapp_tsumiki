# 贡献指南

感谢你对湖南大学微生活小程序 (Tsumiki 版) 的关注. 在开始贡献之前, 请先阅读本指南, 了解开发环境, 文档结构与代码提交规范.

## 开发指南

### 开发文档

设计文档与开发规范存放于 `docs/` 目录, 是本项目规范的权威来源, 开发前请先阅读:

- [`index.md`](./index.md) — 文档总入口
- [`deploy.md`](./deploy.md) — 部署项目
- [`structure.md`](./structure.md) — 项目结构 (按页聚合 + 按路径分类)
- [`state-manager.md`](./state-manager.md) — 状态管理 (Context + Hook 状态业务分离)
- [`style-scheme.md`](./style-scheme.md) — 样式方案 (原子类 + 内联 + SCSS 兜底)
- [`common-function.md`](./common-function.md) — 通用组件 / 函数 / Hook 清单

### 技术栈

| 名称               | 文档地址                                                    | 备注                                          |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------- |
| 微信小程序开发文档 | https://developers.weixin.qq.com/miniprogram/dev/framework/ | 微信小程序官方文档                            |
| Taro               | https://docs.taro.zone/docs/                                | 移动端解决方案 (4.1.11, vite 编译)            |
| React              | https://zh-hans.react.dev/reference/react                   | JS 界面构建库                                 |
| TypeScript         | https://ts.nodejs.cn/                                       | 一种基于 JavaScript 构建的强类型编程语言      |
| pnpm               | https://pnpm.io/zh/                                         | 包管理器 (11.10.0)                            |
| clsx               | https://www.npmjs.com/package/clsx                          | 类名拼接工具 (经 `src/utils/cn.ts` 导出 `cn`) |
| @twisuki/ohday     | https://www.npmjs.com/package/@twisuki/ohday                | 自研日期时间库, 用于日期相关处理              |
| ESLint             | https://eslint.org/docs/latest/                             | 代码检查与格式化 (@antfu/eslint-config)       |
| Sass               | https://sass-lang.com/                                      | 样式兜底方案                                  |

### 项目结构

本项目采用 `按页聚合` 与 `非结构化命名, 按路径分类` 的结构, 具体设计见 [项目结构](./structure.md).

```shell
src
├─ apis                                # API 接口层
│  ├─ index.ts                         # API 统一导出
│  └─ models                           # API 数据模型
├─ components                          # 通用组件
│  ├─ card                             # 卡片组件 (Card / CardHeader / CardContent 等)
│  ├─ page                             # 页面容器组件 (Page / PageContent)
│  ├─ tabs                             # 标签页组件
│  └─ ...                              # 其他通用组件
├─ config                              # 配置层 (env / 颜色 / 存储键 / 日志标签等)
├─ contexts                            # 全局 React Context (auth / setting / semester)
├─ hooks                               # 通用 Hooks (请求 / 存储 / 课程 / 成绩等)
├─ libs                                # 基础库 (请求 / 鉴权请求 / 登录引导桥接等)
├─ pages                               # 主包页面, 按页聚合
│  ├─ index                            # 首页
│  ├─ toolkit                          # 工具箱
│  ├─ table                            # 课表
│  ├─ profile                          # 我的
│  ├─ feedback                         # 意见反馈
│  ├─ feedback-history                 # 反馈历史
│  └─ ...                              # 其余页面
├─ setting                             # 设置页分包
├─ tools                               # 工具页分包
├─ about                               # 关于页分包
├─ static                              # 静态资源, 内部结构与页面路径同构
├─ types                               # 类型定义
├─ utils                               # 通用工具函数
│  ├─ cn.ts                            # 类名拼接
│  ├─ ohday.ts                         # 日期时间处理 (基于 @twisuki/ohday)
│  ├─ logger.ts                        # 通用日志 (替代 console.log)
│  └─ ...                              # 其他工具函数
├─ app.config.ts                       # 小程序入口, 相当于小程序中的 app.json
├─ app.tsx                             # 入口文件
├─ index.html                          # index.html
└─ theme.json                          # 主题变量 (深浅色)
```

## Issue 报告规范

- Issue 列表仅用于 bug 报告与功能建议, 不符合的内容会被直接关闭.
- 提交之前先搜索是否已有相同 Issue, 它可能已经被回答甚至被解决.
- 请清楚描述复现问题的步骤, 并使用最少的代码复现异常行为, 明确说明预期行为与实际行为.
- 没有清晰复现步骤的 Issue 不会被优先处理.
- 如果 Issue 已解决但仍是打开状态, 请及时关闭.

## PR 与分支规范

- 不要直接提交到 `main`, 所有改动都应通过分支与 PR 完成.
- 分支命名格式为 `title/scope/description-author-MMDD`:
  - `title` 为提交类型 (`feat` / `fix` 等)
  - `scope` 为改动范围 (可省略)
  - `description` 为简短描述
  - `author` 为作者
  - `MMDD` 为月日
  - 示例: `fix/index/card-setting-twisuki-0729`, `refactor/api-caiwen-0701`
- PR 中可以有多个小提交, 合并时会使用 squash merge 压缩为单个提交, 并在合并后删除源分支.
- 分支开发期间若需与主分支同步, 尽可能使用 rebase 而非 merge, 保持提交历史线性.
- 新增功能: 请提供充分的理由, 最好先提出建议并得到确认后再动手.
- 修复 bug: 请在 PR 中提供详细描述, 或关联对应的 Issue.

## 代码提交规范

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/), 描述使用中文, 由 Git Hooks 中的 Commitlint (`commitlint.config.mjs`) 在 `commit-msg` 阶段校验.

### 提交前检查

项目配置了 [Husky](https://typicode.github.io/husky/) Git Hooks:

- `pre-commit`: 提交前自动运行 `pnpm check` 与 `pnpm lint`, 不通过则无法提交.
- `commit-msg`: 通过 Commitlint 校验提交信息是否符合上述规范.

## 开发与测试

常用命令:

```shell
pnpm dev      # 开发监听, 实时构建
pnpm build    # 生产构建
pnpm check    # tsc --noEmit, 类型检查
pnpm lint     # eslint ., 代码检查
pnpm fix      # eslint . --fix, 自动修复
```

微信开发者工具提供了 `模拟器` 功能，可以对小程序界面进行模拟。模拟器底部有 `打开webview调试页` 的按钮，可以检查网络请求、样式表、元素、控制台输出等，使用方法和浏览器的开发者工具相同。注意：快捷键 F12 打开的是微信开发者工具本身的调试页，无法用于调试小程序。

某些情况下，模拟器和真机的行为并不相同。如果想要在真机上测试，可以点击工具栏上的 `预览` 按钮，或者使用快捷键 `Ctrl+Shift+P`，然后使用真机上的微信扫描生成的二维码即可。开始真机调试后可能会出现类似网络请求无法完成的问题，可以在右上角的更多按钮里选择 `开发调试` > `打开调试`，如果不是小程序本身的 bug 的话就能解决。

## AI 协作规范

本项目重度依赖 AI 辅助开发, 为确保代码质量:

1. 提交前请审查并测试所有 AI 生成的内容, 责任在于提交者而非 AI.
2. 请遵循仓库根目录 [`../AGENTS.md`](../AGENTS.md) 的协作规范, 改动代码后至少运行 `pnpm check` 与 `pnpm lint`.
3. 不要使用 AI 代答评审意见 (翻译除外).
