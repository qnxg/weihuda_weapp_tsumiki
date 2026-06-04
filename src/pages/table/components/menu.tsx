import { View } from "@tarojs/components"
import { useState } from "react"
import { Icon } from "@/components/icon"
import AddIcon from "@/static/table/add.svg"
import CloseIcon from "@/static/table/close.svg"
import ExtraIcon from "@/static/table/extra.svg"
import MoreIcon from "@/static/table/more.svg"
import SettingIcon from "@/static/table/setting.svg"

export function Menu() {
  const [isActive, setIsActive] = useState(false)

  return (
    <View
      className="absolute size-xs flex center rounded-full bg-primary"
      onClick={() => setIsActive(!isActive)}
      style={{
        // size-xs 一半大小
        bottom: "40rpx",
        right: "40rpx",
      }}
    >
      <Icon
        theme="dark"
        src={isActive ? CloseIcon : MoreIcon}
        style={{
          // size-xs 一半大小
          width: "40rpx",
          height: "40rpx",
        }}
      />
      <View
        className="absolute size-xs flex center rounded-full bg-primary"
        style={{
          top: "0",
          // 同 size-xs
          left: "-80rpx",
          transform: isActive ? "translateX(-100%)" : "",
          opacity: isActive ? "1" : "0",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={AddIcon}
          style={{
            // size-xs 一半大小
            width: "40rpx",
            height: "40rpx",
          }}
        />
      </View>
      <View
        className="absolute size-xs flex center rounded-full bg-primary"
        style={{
          // 同 size-xs, 斜向 sqrt(2) / 2 倍
          top: "-64rpx",
          left: "-64rpx",
          transform: isActive ? "translate(-50%, -50%)" : "",
          opacity: isActive ? "1" : "0",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={SettingIcon}
          style={{
            // size-xs 一半大小
            width: "40rpx",
            height: "40rpx",
          }}
        />
      </View>
      <View
        className="absolute size-xs flex center rounded-full bg-primary"
        style={{
          // 同 size-xs
          top: "-80rpx",
          left: "0",
          transform: isActive ? "translateY(-100%)" : "",
          opacity: isActive ? "1" : "0",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      >
        <Icon
          theme="dark"
          src={ExtraIcon}
          style={{
            // size-xs 一半大小
            width: "40rpx",
            height: "40rpx",
          }}
        />
      </View>
    </View>
  )
}
