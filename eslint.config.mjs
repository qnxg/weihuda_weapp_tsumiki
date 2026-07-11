import antfu from "@antfu/eslint-config"

export default antfu({
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  react: true,
}).removeRules(
  "react-hooks-extra/no-direct-set-state-in-use-effect",
  "react-refresh/only-export-components",
  "react/no-array-index-key",
)
