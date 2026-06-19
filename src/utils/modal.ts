import Taro from "@tarojs/taro"

type ModalType = "default" | "dangerous"

/**
 * @description 带简单样式和事件处理的 modal
 */
export function showModal(
  title: string,
  content: string,
  type: ModalType = "default",
  onConfirm?: () => void,
  onCancel?: () => void,
): Promise<boolean> | void {
  const confirmColor = type === "dangerous" ? "#ff5555" : "#328ccb"
  const cancelColor = type === "dangerous" ? "#328ccb" : "#aeaeae"

  const promise = Taro.showModal({
    title,
    content,
    confirmColor,
    cancelColor,
  }).then((res) => {
    if (res.confirm) {
      onConfirm?.()
    }
    else {
      onCancel?.()
    }
    return res.confirm
  })

  if (onConfirm !== undefined) {
    return
  }

  return promise
}
