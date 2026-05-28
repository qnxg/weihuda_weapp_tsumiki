import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  react: true,
}).removeRules(
  "node/prefer-global/process",
  "no-console",
  "react-hooks-extra/no-direct-set-state-in-use-effect",
  "react-refresh/only-export-components",
)
