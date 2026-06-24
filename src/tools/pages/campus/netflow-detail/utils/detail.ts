/**
 * @description 解析流量应用名称
 * @param name - 原始名称，格式如 "分类/应用名"
 */
export function parseNetflowItemName(name: string) {
  const parts = name.split("/")
  const firstIndex = parts.findIndex(part => part.trim())
  if (firstIndex === -1) {
    return { title: "", content: "" }
  }
  return {
    title: parts[firstIndex] ?? "",
    content: parts.slice(firstIndex + 1).join("/"),
  }
}
