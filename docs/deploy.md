# 部署项目

在进行工作之前, 你需要首先确保项目的开发环境可以在你的电脑上正常运行, 你可以参照这篇教程来完成项目的部署.

## 准备工作

在开始前, 你需要安装这些:

- [Node.js 22](https://nodejs.org) (参考 `.nvmrc`), 并使用 Corepack 或全局安装启用 [pnpm](https://pnpm.io/zh/) `11.10.0`.
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Apifox](https://docs.apifox.com/download)(可选), 用于开发过程中为前端提供 Mock 接口. 若不安装桌面版应用, 也可使用网页版
- [Git](https://git-scm.com/install/)

完成后, 你需要安装 pnpm

```shell
npm i -g pnpm
```

本项目使用 pnpm 管理依赖。请不要混用 `npm` 或 `yarn`, 否则可能会出现依赖相关的问题 (项目下出现 `package-lock.json` / `yarn.lock` 即表示混用了其他包管理器).

## 启动项目

1. 克隆此存储库

```shell
git clone https://github.com/qnxg/weihuda_weapp_tsumiki
```

2. 安装依赖

```shell
pnpm install
```

3. 启动项目

```shell
pnpm dev
```

运行以上命令后当前工作目录中会出现 `dist` 文件夹, 这是项目的打包结果, 同时会监听文件变化, 每次文件发生变化时都会重新打包.

## 将项目导入微信开发者工具

构建完成后, 你需要:

1. 打开微信开发者工具
2. 点击右上角的 `导入`, 并选择项目目录下的 `dist` 目录

![Screenshot](assets/devtools-import-dist.png)

3. AppID 后面可选择使用测试号, 然后在后端服务中选择 `不使用云开发`, 点击 `创建` 按钮

![Screenshot](assets/devtools-create-project.png)

## Mock 接口配置

前端开发需要使用 Apifox 来提供一套临时接口供前端调用。你可以按以下步骤配置 Mock 接口.

1. 前往 [Apifox 网站](https://apifox.com) 安装 Apifox 或使用 Web 版
2. 前往 QQ 群索要 Apifox 接口文档邀请链接
3. 接受邀请后, 左侧 `我的团队` 中会出现 `易千`, 点击进入后, 右侧选择 `微生活 API v2 (Tsumiki)`

![Screenshot](assets/apifox-team-project.png)

4. 页面右上角点击三条横线图标, 找到云端 Mock, 复制 `默认模块` 的 `前置 URL` 的值, 并将其填入 `.env` 文件的 `TARO_APP_BASE_URL` 处, 例如 `TARO_APP_BASE_URL="https://example.com/xxxxxx"`

![Screenshot](assets/apifox-cloud-mock-default-module.png)

![Screenshot](assets/apifox-cloud-mock-prefix-url.png)

5. 回到微信开发者工具, 点击右上角三条横线图标, 在 `本地设置` 中勾选 `不校验合法域名`

![Screenshot](assets/devtools-local-settings.png)

## 本地环境配置

项目下的 `.env` 文件定义了一些影响编译结果的变量, 如后端 URL `TARO_APP_BASE_URL`、日志级别 `TARO_APP_LOG_LEVEL`、存储过期时间 `TARO_APP_STORAGE_EXPIRED_TIME` 等, 可根据需要自己调整.

`.env` 文件已被 `.gitignore` 排除, 不会提交到远程. 需要查看可用的环境变量可以参考 `.env-example`:

```env
TARO_APP_BASE_URL=http://localhost:8080
TARO_APP_LOG_LEVEL=4
TARO_APP_STORAGE_EXPIRED_TIME=604800000
```

各环境变量的含义与默认值见 `src/config/env.ts` 的 `ENV` 配置.
