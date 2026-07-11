import type { UserConfigExport } from "@tarojs/cli"
import * as path from "node:path"

import { defineConfig } from "@tarojs/cli"
import devConfig from "./dev"
import prodConfig from "./prod"

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "weihuda_weapp_tsumiki",
    date: "2026-5-20",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    alias: {
      "@": path.resolve(__dirname, "..", "src/"),
    },
    outputRoot: "dist",
    plugins: [
      "@tarojs/plugin-generator",
    ],
    defineConstants: {
    },
    copy: {
      patterns: [
        { from: "src/static/tab/index-dark-selected.png", to: "dist/static/tab/index-dark-selected.png" },
        { from: "src/static/tab/toolkit-dark-selected.png", to: "dist/static/tab/toolkit-dark-selected.png" },
        { from: "src/static/tab/table-dark-selected.png", to: "dist/static/tab/table-dark-selected.png" },
        { from: "src/static/tab/profile-dark-selected.png", to: "dist/static/tab/profile-dark-selected.png" },
      ],
      options: {
      },
    },
    framework: "react",
    compiler: "vite",
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  }

  // eslint-disable-next-line node/prefer-global/process
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
