<p align="center">
  <img src="./docs/assets/hero.png" width="100%" alt="湖南大学微生活小程序 Tsumiki 版: 课表管理、成绩查询、校园卡、电费、流量等校园信息一站式查询">
</p>

# 湖南大学微生活小程序 (Tsumiki 版)

湖南大学校园信息一站式查询微信小程序. 课表管理、成绩查询、校园卡余额、电费查询、校园网流量、考试安排等校园服务, 一个小程序全部搞定.

## 快速开始

环境准备、安装启动、微信开发者工具导入与 Mock 接口配置, 请见 [部署项目](docs/deploy.md).

常用命令:

```bash
pnpm dev      # 开发监听, 实时构建
pnpm build    # 生产构建
pnpm check    # 类型检查
pnpm lint     # 代码检查
pnpm fix      # 自动修复
```

## 贡献

欢迎贡献代码. 请先阅读 [贡献指南](docs/CONTRIBUTING.md), 了解分支规范、提交规范与 AI 协作要求.

### 提交规范

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/), 描述使用中文. 示例:

```
feat(体测标准): 完成体测标准介绍页和男生页
fix(index): 修复课表卡片在深色模式下文字不可见的问题
docs: 补充贡献指南的代码提交规范
```

### 文档

详细设计文档与开发规范位于 `docs/` 目录:

- [项目结构](docs/structure.md) — 按页聚合 + 按路径分类
- [状态管理](docs/state-manager.md) — Context + Hook 状态业务分离
- [样式方案](docs/style-scheme.md) — 原子类 + 内联 + SCSS 兜底
- [通用组件与函数](docs/common-function.md) — 可复用模块清单
- [部署项目](docs/deploy.md) — 开发环境搭建
- [贡献指南](docs/CONTRIBUTING.md) — 开发流程与规范
