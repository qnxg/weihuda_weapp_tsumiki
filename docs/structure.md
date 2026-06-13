# 项目结构

本项目采用 `按页聚合` 和 `非结构化命名, 按路径分类` 的项目结构.

## 文件结构

```plain text
├── src/                          # 源代码目录
│   ├── apis/                     # API 接口层
│   │   ├── index.ts              # API 统一导出
│   │   └── models/               # API 数据模型
│   ├── assets/                   # 静态资源
│   │   └── css/                  # 全局样式
│   ├── components/               # 通用组件
│   ├── config/                   # 配置层
│   ├── contexts/                 # React Context
│   ├── hooks/                    # 通用 Hooks
│   ├── libs/                     # 基础库
│   ├── pages/                    # 页面 (按页聚合)
│   │   ├── index/               # 首页
│   │   │   ├── components/     # 首页内部组件
│   │   │   ├── contexts/        # 首页上下文
│   │   │   └── hooks/          # 首页 Hooks
│   │   ├── profile/            # 个人中心页
│   │   ├── table/              # 课表页
│   │   │   ├── components/    # 课表组件
│   │   │   └── utils/         # 课表工具函数
│   │   └── toolkit/            # 工具箱页
│   ├── setting/                 # 设置页 (Taro 分包)
│   │   └── pages/
│   ├── static/                 # 静态页面数据
│   ├── tools/                  # 工具页 (Taro 分包)
│   │   └── pages/
│   ├── types/                  # 类型定义
│   ├── utils/                  # 通用工具函数
│   ├── app.config.ts          # 应用配置
│   ├── app.tsx                # 应用入口
│   └── index.html             # HTML 入口
├── config/                     # 项目配置
├── docs/                       # 项目文档
├── types/                      # 全局类型定义
├── .env                       # 环境变量
├── .env-example               # 环境变量示例
├── .husky/                     # Git Hooks
├── babel.config.js            # Babel 配置
├── commitlint.config.mjs      # CommitLint 配置
├── eslint.config.mjs          # ESLint 配置
├── project.config.json        # Taro 项目配置
├── tsconfig.json             # TypeScript 配置
└── package.json               # 项目依赖配置
```

## 基础结构

尽管 React 一般为 SPA, Taro 也按照类似 SPA 的方式构建页面, 但小程序本身使用 `页面栈` 的概念组织页面, 因此每个页面依旧需要一个传统路由的文件夹.

Taro 的这部分组织如下:

### 主包

主包位于 `src/pages/` 目录下, 每个页面为一个单独的文件夹, 包含 `index.tsx` 入口文件和 `index.config.ts` 配置文件, 此外还可以有 `index.scss` 样式文件和其他组织类文件夹.

其中, 文件夹可以嵌套, 路由也可跨越多层文件夹, 但路由之间不可嵌套.

例如: `src/pages/index/` 下有 `index.tsx` 和 `index.config.ts`, 表示首页, 此外还有 `components/`, `contexts/`, `hooks/` 等文件夹, 用于逻辑分组.

### 分包

为减小包体积, 小程序不会一次性下载所有的包, 主包直接下载, 分包按需下载.

分包要求和主包类似, 依旧需要不可嵌套的路由文件夹.

本项目中, 有 `tools` 和 `setting` 两个分包, 分别位于 `src/tools/` 和 `src/setting/` 目录下, 每个分包的组织方式与主包相同. (但当前分包只有 `/pages` 文件夹)

### 页面注册

微信小程序要求根目录下有 `app.json` 文件, 用于注册所有路由, Taro 中, 该文件由 `src/app.config.ts` 编译而成, 详见 [Taro - 全局配置](https://docs.taro.zone/docs/app-config/)

## 设计理念

### 按页聚合

React 项目中一般有单独的 `compponents/` 组件文件夹, `contexts/` 上下文文件夹, `hooks/` 钩子函数文件夹, 此外还有 `utils/` 工具函数文件夹, `libs/` 库函数文件夹, 以及 `apis/` API 接口文件夹等.

全局通用内容放置到 `src/components/`, `src/contexts/` 等文件夹中, 某页面内专用的内容放置到 `src/pages/xxx/components/`, `src/pages/xxx/contexts/` 等文件夹中, 以实现按页聚合.

例如, `src/components/` 均为通用组件, `src/pages/index/components/` 均为首页内专用的组件, `contexts` 和 `hooks` 等同理.

### 非结构化命名, 按路径分类

文件命名仅以 Feature 命名, 不包含层级和功能信息, 以保证命名简单.

例如, 本项目中存在大量 `setting.{ts|tsx}` 的同名文件, 表明它们都是设置功能相关的文件.

而它们分别位于 `contexts/setting.tsx`, `hooks/setting.ts`, `config/setting.ts` 等, 通过路径区分它们的功能和层级.

- `contexts/setting.tsx` - 合理命名, 设置相关的 React Context
- `contexts/setting-context.tsx` - 冗长命名, context 信息重复
