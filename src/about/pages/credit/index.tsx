import type { Item } from "@/about/pages/credit/components/section"
import { View } from "@tarojs/components"
import Section from "@/about/pages/credit/components/section"
import { Page, PageContent } from "@/components/page"
import BabelIcon from "@/static/about/credit/babel.svg"
import CommitlintIcon from "@/static/about/credit/commitlint.svg"
import EslintIcon from "@/static/about/credit/eslint.svg"
import HuskyIcon from "@/static/about/credit/husky.svg"
import ReactIcon from "@/static/about/credit/react.svg"
import ScssIcon from "@/static/about/credit/scss.svg"
import TypeScriptIcon from "@/static/about/credit/typescript.svg"
import ViteIcon from "@/static/about/credit/vite.svg"

interface SectionItem {
  title: string
  items: Item[]
}

const sections: SectionItem[] = [
  {
    title: "框架",
    items: [
      { title: "React", icon: ReactIcon, description: "用于构建用户界面的 JavaScript 库, 基于组件化与声明式编程.", version: "18.0.0", license: "MIT" },
      { title: "Taro", description: "开放式跨端跨框架解决方案, 支持使用 React / Vue 等框架开发多端应用.", version: "4.1.11", license: "MIT" },
      { title: "TypeScript", icon: TypeScriptIcon, description: "JavaScript 的类型化超集, 在编译期进行静态类型检查.", version: "5.4.5", license: "Apache-2.0" },
      { title: "Sass", icon: ScssIcon, description: "CSS 预处理器, 提供变量 / 嵌套 / mixin 等高级特性.", version: "1.75.0", license: "MIT" },
    ],
  },
  {
    title: "工具",
    items: [
      { title: "@radix-ui/react-slot", description: "Radix UI 的组件组合原语, 通过 Slot 实现 asChild 模式, 让组件可以将其样式与行为代理给子元素.", version: "1.2.4", license: "MIT" },
      { title: "@twisuki/ohday", description: "易千自研的链式调用 / 不可变 / 轻量的日期时间处理库.", version: "1.0.5", license: "MIT" },
      { title: "clsx", description: "轻量级 className 拼接工具, 支持条件类名与多源合并.", version: "2.1.1", license: "MIT" },
    ],
  },
  {
    title: "构建",
    items: [
      { title: "Vite", icon: ViteIcon, description: "下一代前端构建工具, 基于原生 ES 模块实现极速冷启动与热更新.", version: "4.2.0", license: "MIT" },
      { title: "Babel", icon: BabelIcon, description: "JavaScript 编译器, 将新版语法 / JSX / TypeScript 等转换为向后兼容的代码.", version: "7.24.4", license: "MIT" },
    ],
  },
  {
    title: "工程化",
    items: [
      { title: "ESLint", icon: EslintIcon, description: "可插拔的 JavaScript / JSX 静态检查工具, 通过规则识别代码中的问题.", version: "9", license: "MIT" },
      { title: "@antfu/eslint-config", description: "Anthony Fu 的 ESLint 预设配置, 提供开箱即用的代码风格与格式化.", version: "7.6.1", license: "MIT" },
      { title: "commitlint", icon: CommitlintIcon, description: "Git 提交信息检查工具, 强制遵循 Conventional Commits 规范.", version: "19.8.1", license: "MIT" },
      { title: "Husky", icon: HuskyIcon, description: "Git hooks 管理工具, 用于在提交 / 推送时触发自动化任务.", version: "9.1.7", license: "MIT" },
    ],
  },
]

export default function Credit() {
  return (
    <Page>
      <PageContent className="h-full">
        <View className="flex flex-col py">
          {sections.map((item, index) => (
            <Section
              key={index}
              title={item.title}
              items={item.items}
            />
          ))}
        </View>
      </PageContent>
    </Page>
  )
}
