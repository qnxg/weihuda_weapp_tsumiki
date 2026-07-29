import { View } from "@tarojs/components"
import { Table, TableCell } from "./table"

const ITEMS = [
  { name: "体重指数 (BMI)", weight: "15" },
  { name: "肺活量", weight: "15" },
  { name: "50米跑", weight: "20" },
  { name: "坐位体前屈", weight: "10" },
  { name: "立定跳远", weight: "10" },
  { name: "引体向上(男) / 1分钟仰卧起坐(女)", weight: "10" },
  { name: "1000米跑(男) / 800米跑(女)", weight: "20" },
  { name: "视力(裸眼, 串镜, 屈光不正)", weight: "不占分数" },
] as const

const LEVELS = [
  { level: "优秀", score: "≥ 90.0" },
  { level: "良好", score: "80.0 - 89.9" },
  { level: "及格", score: "60.0 - 79.9" },
  { level: "不及格", score: "≤ 59.9" },
] as const

export function Intro() {
  return (
    <View className="flex flex-col gap p">
      <View className="flex flex-col">
        <View className="text-xl text-highlight text-bold">体质测试项目内容</View>
        <Table
          cols={2}
          style={{ gridTemplateColumns: "1fr max-content" }}
        >
          <TableCell className="text-bold justify-start">单项指标</TableCell>
          <TableCell className="text-bold">权重 (%)</TableCell>
          {ITEMS.flatMap(item => [
            <TableCell key={`${item.name}-name`} className="justify-start">{item.name}</TableCell>,
            <TableCell key={`${item.name}-weight`}>{item.weight}</TableCell>,
          ])}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-highlight text-bold">体质测试分数评定等级</View>
        <Table cols={2}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">分数</TableCell>
          {LEVELS.flatMap(item => [
            <TableCell key={`${item.level}-level`}>{item.level}</TableCell>,
            <TableCell key={`${item.level}-score`}>{item.score}</TableCell>,
          ])}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-highlight text-bold">体质测试分数说明</View>
        <View className="text-highlight text-bold">分数构成</View>
        <View>
          1.
          {" "}
          学年总分由标准分与附加分之和构成,
          {" "}
          满分为120分
        </View>
        <View>
          2.
          {" "}
          标准分由各单项指标得分与权重成绩之和组成,
          {" "}
          满分为100分
        </View>
        <View>
          3.
          {" "}
          附加分根据实测成绩确定,
          {" "}
          即对成绩超过100分的加分指标进行加分,
          {" "}
          满分为20分
        </View>
        <View className="text-highlight text-bold">加分项</View>
        <View>
          男生加分指标:
          {" "}
          引体向上和1000米,
          {" "}
          各占10分
        </View>
        <View>
          女生加分指标:
          {" "}
          一分钟仰卧起坐和800米,
          {" "}
          各占10分
        </View>
        <View className="text-highlight text-bold">毕业成绩</View>
        <View>
          学生毕业时的成绩和等级,
          {" "}
          按毕业当年学年总分的50%,
          {" "}
          与其他学年总分平均得分的50%之和进行评定
        </View>
      </View>
    </View>
  )
}
