import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { Card, CardHeader } from "@/components/card"
import { Skeleton } from "@/components/skeleton"
import { useSemester } from "@/hooks/semester"
import { IndexCardContent } from "@/pages/index/components/cards/index-card-content"
import CountDownIcon from "@/static/index/count-down.svg"
import { getSemesterDateInfo } from "@/utils/semester"

/**
 * @description 假期倒计时
 */
export function CountDown() {
  const { data, isLoading } = useSemester()

  const [next, setNext] = useState(0)

  useEffect(() => {
    if (data) {
      const { next: newNext } = getSemesterDateInfo(data)
      setNext(newNext)
    }
  }, [data])

  return (
    <Card>
      <CardHeader
        icon={CountDownIcon}
        title="假期倒计时"
        action="查看校历"
        to="/tools/pages/campus/calender/index"
      />
      <IndexCardContent
        className="p flex items-center text-xl"
        isLoading={isLoading}
        isFailed={!data}
        onRefresh={() => {}}
      >
        {data
          ? (
              <>
                <View>
                  距离
                  {data.xq === "autumn" || data.xq === "spring" ? "本学期结束" : "下学期开始"}
                  还有
                </View>
                <View className="flex items-center px gap">
                  {String(next).padStart(3, "0").split("").map((num, index) => (
                    <View
                      key={index}
                      className="text-2xl text-highlight text-bold p bg-subtle rounded-sm"
                    >
                      {num}
                    </View>
                  ))}
                </View>
                <View>
                  天
                </View>
              </>
            )
          : <Skeleton className="w-full" /> }
      </IndexCardContent>
    </Card>
  )
}
