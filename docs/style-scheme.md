# 样式方案

本项目采用原子化 + 内联 + SCSS 兜底的分层样式方案.

## 原子化样式

原子化样式使得样式本身更加易读易写, 但由于微信小程序框架现在, wxss 不完全等同于 css, 因此部分选择器无法使用, 导致主流的原子化方案 `Tailwind CSS` 很难直接使用.

因此本项目自行维护了一套原子化样式, 主要包括 `颜色`, `文本`, `布局`, `间距`, `尺寸` 五大方面.

大部分原子化类由 `type` 和 `token` 两部分构成, 而非 `Tailwind CSS` 的魔法数字, 项目内更统一.

因此本项目优先使用原子类实现样式, 并通过 `cn` 方法拼接原子类, 必要时再降级到内联 style.

提供的原子类如下:

### 颜色

本项目颜色使用媒体选择器维护, 因此可自适应深浅主题

#### 文本颜色 `.text`

- `text-hightlight`: 高亮文本颜色, 较基础颜色更强烈 (深浅默认颜色相反)
- `text-base`: 基础文本颜色 (浅色模式为深色文本, 深色模式相反)
- `text-toned`: 柔和文本颜色, 较基础颜色更浅 (深浅默认颜色相反)
- `text-muted`: 次要文本颜色, 较柔和颜色更浅 (深浅默认颜色相反)
- `text-reverse`: 反转文本颜色, 适用于有色背景下的文本 (浅色模式为白色, 深色模式为黑色)
- `text-primary`: 主要文本颜色, 适用于强调文本 (为主题蓝色)

#### 背景颜色 `.bg`

- `bg-base`: 基础背景色 (浅色模式浅色, 深色模式深色)
- `bg-page`: 页面背景色, 较基础背景更强烈, 用于页面背景
- `bg-primary`: 主要背景色, 用于强调/选中状态 (为主题蓝色)
- `bg-transparent`: 透明背景
- `bg-shadow`: 遮罩背景色, 用于弹窗/底部弹出等场景
- `bg`: 同 `bg-base` 的简写

#### 边框颜色 `.border`

- `border-hightlight`: 高亮边框
- `border-base`: 基础边框
- `border-toned`: 柔和边框
- `border-muted`: 次要边框
- `border-reverse`: 反转边框
- `border-primary`: 主题色边框

### 文本

#### 文本大小 `.text-`: `sm`, `md`, `lg`, `xl`, `2xl`

#### 其他样式

- `text-bold`: 粗体文本

#### 简写样式

- `text`: 基础文本 (颜色 + 默认大小)
- `bold`: 高亮粗体
- `italic`: 斜体
- `underline`: 下划线
- `ellipsis`: 单行省略

### 布局

#### 定位

- `relative`: 相对定位
- `absolute`: 绝对定位

#### Flex 布局

- `flex`: 弹性盒
- `flex-col`: 弹性盒, 纵向排列
- `flex-1`: `flex: 1`
- 主轴定位: `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly`
- 交叉轴定位: `items-start`, `items-center`, `items-end`

#### 简写属性

- `center`: 同时居中 (`align-items: center` + `justify-content: center`)
- `overflow-hidden`: 溢出隐藏
- `hidden`: 隐藏 (`display: none`)
- `opacity`: 透明 (`opacity: 0`)

#### 圆角 `.rounded`: `sm`, `md`, `lg`, `xl`, `full` (无后缀时默认 `md`)

### 间距

间距支持 `padding`、`margin`、`gap`、`inset` 四类, 每种均按方向分为全向、水平 (`x`)、垂直 (`y`) 三种, 并提供以下 token: `xs`, `sm`, `md`, `lg`, `xl` (无后缀时默认 `md`)

#### Padding

- `p-*`: 四方向 padding
- `px-*`: 水平 padding
- `py-*`: 垂直 padding

#### Margin

- `m-*`: 四方向 margin
- `mx-*`: 水平 margin
- `my-*`: 垂直 margin

#### Gap

- `gap-*`: flex 子项间距

#### Inset

- `inset-*`: 四方向定位
- `inset-0`: 四方向归零

### 尺寸

尺寸分为 `size` (等宽等高)、`w` (宽度)、`h` (高度) 三类, 提供以下 token: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` (无后缀时默认 `md`)

#### 特殊值 (仅 `w` / `h`)

- `full`: 100%
- `screen`: 100vw / 100vh
- `fit`: fit-content

#### 简写

- `size-*`: 等宽等高
- `w-*`: 仅宽度
- `h-*`: 仅高度

## 内联样式

原子化样式未提供的其他颜色 / 尺寸值, 以及需要 js 动态操作的样式, 可使用内联 style.

本项目不适合伪元素写法, 因此需要使用伪元素时, 使用真实 dom 实现, 以便可插入原子类和内联样式.

## SCSS 样式

该方案作为兜底方案, 仅当上述两种方案均无法处理时才使用, 例如 css 关键帧动画等.
