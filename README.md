<div align="center">
  <img src="./docs/assets/hero.png" width="100%" alt="湖南大学微生活小程序 Tsumiki 版: 课表管理、成绩查询、校园卡、电费、流量等校园信息一站式查询">
  <p>
    <a href="https://github.com/qnxg/weihuda_weapp_tsumiki/stargazers"><img src="https://img.shields.io/github/stars/qnxg/weihuda_weapp_tsumiki?style=for-the-badge&logo=github&label=Stars" alt="Stars"></a>
    <a href="https://github.com/qnxg/weihuda_weapp_tsumiki/graphs/contributors"><img src="https://img.shields.io/github/contributors/qnxg/weihuda_weapp_tsumiki?style=for-the-badge&logo=github&label=Contributors" alt="Contributors"></a>
    <img src="https://img.shields.io/badge/Taro-4.1.11-05C5F1?style=for-the-badge" alt="Taro">
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/@twisuki%2Fohday-1.0.5-0ABF53?style=for-the-badge&logo=npm&logoColor=white" alt="@twisuki/ohday">
  </p>
</div>

## 概述

湖南大学校园信息一站式查询微信小程序. 课表管理、成绩查询、校园卡余额、电费查询、校园网流量、考试安排等校园服务, 一个小程序全部搞定.

## 快速开始

环境准备、安装启动、微信开发者工具导入与 Mock 接口配置, 详见 [部署项目](docs/deploy.md).

常用命令:

```bash
pnpm dev      # 开发监听, 实时构建
pnpm build    # 生产构建
pnpm check    # 类型检查
pnpm lint     # 代码检查
pnpm fix      # 自动修复
```

## 贡献

欢迎贡献代码. 请先阅读 [贡献指南](docs/contributing.md), 了解分支规范、提交规范与 AI 协作要求. 若要在本地配置开发环境, 请阅读 [部署指南](docs/deploy.md).

### 文档

详细设计文档与开发规范位于 `docs/` 目录:

- [项目结构](docs/structure.md) — 按页聚合 + 按路径分类
- [状态管理](docs/state-manager.md) — Context + Hook 状态业务分离
- [样式方案](docs/style-scheme.md) — 原子类 + 内联 + SCSS 兜底
- [通用组件与函数](docs/common-function.md) — 可复用模块清单
- [部署项目](docs/deploy.md) — 开发环境搭建
- [贡献指南](docs/contributing.md) — 开发流程与规范

## 反馈

你可以通过如下方式反馈问题:

1. Github Issue, 详见 [contributing.md](docs/contributing.md) 的 `Issue 报告规范` 部分
2. [湖大微生活用户交流群](https://qm.qq.com/q/BA6FQbxXBS), QQ 群号为 1051502207. 在群内交流可获得更快的答复.
3. 使用湖大微生活小程序内的反馈功能. 在页面下方点击 `我的`, 选择 `我要反馈` 并填写相关信息即可.
