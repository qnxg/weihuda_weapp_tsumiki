import { Image, View } from "@tarojs/components"
import { showModal, showToast } from "@tarojs/taro"
import { api } from "@/apis"
import { MyButton } from "@/components/my-button"
import { useRequest } from "@/hooks/request"
import { cn } from "@/utils/cn"

export function Goods({
  jifen,
}: Readonly<{
  jifen: number
}>) {
  const { data, isLoading, refetch } = useRequest(() => api.jifen.getGoods())

  const handleClick = async (id: number) => {
    const res = await showModal({
      title: "提升",
      content: "确认兑换吗?",
    })

    if (!res.confirm)
      return

    api.jifen.postGoods(id)
      .then(() => {
        void showToast({
          title: "兑换成功",
          icon: "success",
        })
        void refetch()
      })
      .catch((err) => {
        switch (err.code) {
          case "GOODS_NOT_FOUND":
            void showToast({
              title: "奖品不存在",
              icon: "none",
            })
            break
          case "JIFEN_NOT_ENOUGH":
            void showToast({
              title: "积分不足",
              icon: "none",
            })
            break
          default:
            void showToast({
              title: "兑换失败",
              icon: "none",
            })
        }
      })
  }

  return (
    <View className="flex flex-col gap">
      {!data || data.length === 0
        ? <View className="h flex center text-lg">{isLoading ? "加载中" : "暂无记录"}</View>
        : data.map((item, index) => {
            const active = item.count > 0 && jifen >= item.price && !item.in_redeem

            return (
              <View
                key={`${item.id}-${index}`}
                className="flex gap"
              >
                <View className="size-xl flex center">
                  <Image
                    mode="aspectFit"
                    className="size-xl"
                    src={item.cover}
                  />
                </View>
                <View className="flex-1 h-sm flex flex-col justify-between">
                  <View className="text-lg">{item.name}</View>
                  <View className="text-toned text-sm">{item.description}</View>
                  <View className="flex items-end justify-between">
                    <View>
                      {`${item.price}积分`}
                      {" "}
                      {item.count > 0 ? `剩余: ${item.count}件` : "缺货"}
                    </View>
                    <MyButton
                      className={cn(
                        "w-lg py-xs flex center rounded-sm",
                        active ? "bg-primary text-reverse" : "bg-page text-base",
                      )}
                      disabled={!active}
                      onClick={() => handleClick(item.id)}
                    >
                      {item.in_redeem
                        ? "兑换中"
                        : item.count <= 0
                          ? "已兑完"
                          : jifen < item.price ? "积分不足" : "兑换"}
                    </MyButton>
                  </View>
                </View>
              </View>
            )
          })}
    </View>
  )
}
