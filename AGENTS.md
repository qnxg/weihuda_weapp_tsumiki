# AGENTS.md

湖南大学微生活小程序前端 Tsumiki 版的 AI 协作指南. 面向 Claude Code 等编码 Agent, 汇总项目速览, 命令, 规范约束与文档索引.

## 项目速览

- 微信小程序, 技术栈: Taro 4.1.11 + React 18 + TypeScript, 编译目标为 weapp.
- 状态管理仅用 React Context (无 Redux / Zustand, 原因见下方文档索引).
- 包管理器固定为 `pnpm@11.10.0`, 依赖装配受 `pnpm-workspace.yaml` 中供应链信任策略约束.
- 路径别名: `@/*` -> `src/*` (见 `tsconfig.json`).

## 常用命令

```bash
pnpm dev      # taro build --type weapp --watch, 开发监听
pnpm build    # taro build --type weapp, 生产构建
pnpm check    # tsc --noEmit, 类型检查
pnpm lint     # eslint ., 代码检查
pnpm fix      # eslint . --fix, 自动修复
```

改动代码后请至少运行 `pnpm check` 与 `pnpm lint`; 无独立单元测试框架.

## 文档索引 (改动前必读对应文档)

设计文档位于 `docs/`, 是本项目规范的权威来源, 修改相关部分前先阅读:

- `docs/structure.md` — 项目结构: `按页聚合` + `非结构化命名, 按路径分类`
- `docs/state-manager.md` — 状态管理: Context + Hook 的状态业务分离方案
- `docs/style-scheme.md` — 样式方案: 原子类 + 内联 + SCSS 兜底的分层方案
- `docs/common-function.md` — 通用组件 / 函数 / Hook 清单
- `docs/index.md` — 文档总入口

改动通用内容 (`src/components/`, `src/utils/`, `src/libs/`, `src/hooks/`, `src/contexts/` 等) 后, 须同步更新 `docs/common-function.md`, 保持清单与实际导出一致: 新增 / 删除对应条目, 变更职责时更新描述.

新增 / 删除页面, 或推进页面完成度后, 须同步更新 `docs/structure.md` 的 `页面汇总`: 未完成的页面在描述后标注 `(尚未完成)`, 开发中的标注 `(正常进行)`, 已完成则不加标注.

## 目录约定 (`按页聚合`)

- 全局通用内容放 `src/components/`, `src/contexts/`, `src/hooks/`, `src/utils/`, `src/libs/`, `src/apis/`, `src/config/`, `src/types/`.
- 某页专用内容放该页目录下, 如 `src/pages/index/components/`, `src/pages/index/hooks/`.
- 页面即路由文件夹, 含 `index.tsx` 入口与 `index.config.ts` 配置, 路由文件夹不可嵌套.
- 分包: `src/tools/`, `src/setting/`; 新增页面须同步注册到 `src/app.config.ts`.

## 命名约定 (`非结构化命名, 按路径分类`)

- 文件仅以 Feature 命名, 不含层级 / 功能后缀, 用路径区分功能.
- 例: 设置相关文件统一命名 `setting`, 分别落在 `contexts/setting.tsx`, `hooks/setting.ts`, `config/setting.ts`.
- 反例: `contexts/setting-context.tsx` (信息重复, 冗长).

## 代码风格

- ESLint 采用 `@antfu/eslint-config` (见 `eslint.config.mjs`): 双引号, 2 空格缩进, 无分号, 启用 react 规则.
- 禁止 `console.log`; 需要日志时使用 `src/utils/logger.ts` 的 `logger`.
- 注释与文档用中文, 公共类型 / 函数 / Hook 使用 JSDoc / TSDoc (`@description` / `@property` / `@example`), 参照 `src/hooks/auth.ts`, `src/components/card/index.tsx`.
- 标点统一用半角 (`,` `.` `;` `:` `(` `)`), 不用中文全角标点 (`，` `。` `；` `：` `（` `）`), 中文文本中同样如此; 半角标点后跟一个空格, 如 `全局通用内容放 src/components/, 以实现按页聚合.` 斜杠分隔的并列项两侧留空格, 如 `light / dark / auto`.
- 优先复用 `docs/common-function.md` 列出的通用组件与函数, 不重复造轮子.

## 状态管理要点 (细节见 `docs/state-manager.md`)

- Context 只放最基本的状态变量与 setter, 复杂业务逻辑下沉到对应 Hook (状态业务分离). 参照 `contexts/auth.tsx` + `hooks/auth.ts`.
- Context Provider 的 `value` 用 `useMemo` 稳定, 消费用自定义 `useXxxContext` Hook 并做未挂载兜底 (`throw new Error`).
- `setState` 若用到原值必须函数式更新 (`setX(p => ...)`), 且不要把 state 与其 setState 放进同一个 `useEffect`, 避免死循环.

## 样式要点 (细节见 `docs/style-scheme.md`)

- 分层优先级: 自维护原子类 (通过 `cn` 拼接) > 内联 `style` > SCSS 兜底.
- 原子类覆盖颜色 / 文本 / 布局 / 间距 / 尺寸; 颜色用媒体查询自适应深浅主题, 勿硬编码主题色.
- 无伪元素方案, 需要时用真实 DOM 承载原子类与内联样式.

## 提交与分支

- 提交信息遵循 Conventional Commits (见 `commitlint.config.mjs`), 描述用中文, 如 `feat(体测标准): 完成体测标准介绍页和男生页`.
- 分支命名格式为 `title/scope/description-author-MMDD`: `title` 为 Conventional Commits 类型 (`feat` / `fix` 等), `scope` 为改动范围 (可省略), `description` 为简短描述, `author` 为作者, `MMDD` 为月日. 如 `fix/index/card-setting-twisuki-0729`, `refactor/api-caiwen-0701`.
- 除非明确要求, 不直接提交到 `main`; 仅在用户要求时才创建提交.
- 谨慎处理 `.env` 等可能含密钥的文件, 不提交.

## 依赖与供应链

- `pnpm-workspace.yaml` 启用 `trustPolicy: no-downgrade`. 新增依赖时优先选带 provenance 证明的版本.
- 若因 Taro 工具链锁定旧版本触发信任降级, 用 `overrides` 指向带证明的兼容版本; 无兼容证明版本时才放宽策略 (如 `trustPolicyIgnoreAfter`), 避免直接 `trustPolicyExclude` 整体绕过.
