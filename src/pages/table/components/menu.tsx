import { View } from "@tarojs/components"
import { useState } from "react"
import { Icon } from "@/components/icon"
import AddIcon from "@/static/table/add.svg"
import CloseIcon from "@/static/table/close.svg"
import ExtraIcon from "@/static/table/extra.svg"
import MoreIcon from "@/static/table/more.svg"
import SettingIcon from "@/static/table/setting.svg"
import { cn } from "@/utils/cn"

export function Menu({
  onAddButtonClick,
  onOptionsButtonClick,
  onExtraButtonClick,
}: Readonly<{
  onAddButtonClick: () => void
  onOptionsButtonClick: () => void
  onExtraButtonClick: () => void
}>) {
  const [isActive, setIsActive] = useState(false)

  return (
    <View
      className="absolute size-xl flex center rounded-full bg-primary"
      onClick={() => setIsActive(!isActive)}
      style={{
        // size-xl 一半大小
        bottom: "40rpx",
        right: "40rpx",
      }}
    >
      <Icon
        className="size-xs"
        theme="dark"
        src={isActive ? CloseIcon : MoreIcon}
      />

      {/* 子按钮 */}
      <View
        className={cn(
          "absolute size-xl flex center rounded-full bg-primary",
          !isActive && "opacity",
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (!isActive)
            return
          onAddButtonClick()
        }}
        style={{
          top: "0",
          // 同 size-xl
          left: "-80rpx",
          transform: isActive ? "translateX(-100%)" : "",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={AddIcon}
          className="size-xs"
        />
      </View>
      <View
        className={cn(
          "absolute size-xl flex center rounded-full bg-primary",
          !isActive && "opacity",
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (!isActive)
            return
          onOptionsButtonClick()
        }}
        style={{
          // 同 size-xl, 斜向 sqrt(2) / 2 倍
          top: "-64rpx",
          left: "-64rpx",
          transform: isActive ? "translate(-50%, -50%)" : "",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={SettingIcon}
          className="size-xs"
        />
      </View>
      <View
        className={cn(
          "absolute size-xl flex center rounded-full bg-primary",
          !isActive && "opacity",
        )}
        onClick={(e) => {
          e.stopPropagation()
          if (!isActive)
            return
          onExtraButtonClick()
        }}
        style={{
          // 同 size-xl
          top: "-80rpx",
          left: "0",
          transform: isActive ? "translateY(-100%)" : "",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={ExtraIcon}
          className="size-xs"
        />
      </View>
    </View>
  )
}
