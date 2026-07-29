import { View } from "@tarojs/components"
import { od } from "@/utils/ohday"
import { LevelCell, Table, TableCell, TableHeaderCell } from "./table"

export function Female() {
  return (
    <View className="flex flex-col" style={{ gap: "32rpx" }}>
      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生体重指数(BMI)评分表
        </View>
        <Table cols={3}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>单项成绩</TableHeaderCell>

          <LevelCell level="excellent">正常</LevelCell>
          <TableCell>100</TableCell>
          <TableCell>17.2-23.9</TableCell>

          <LevelCell level="good">低体重</LevelCell>
          <TableCell style={{ gridRow: "span 2" }}>80</TableCell>
          <TableCell>≤ 17.1</TableCell>
          <LevelCell level="pass">超重</LevelCell>
          <TableCell>24.0-27.9</TableCell>

          <LevelCell level="fail">肥胖</LevelCell>
          <TableCell>60</TableCell>
          <TableCell>≥ 28.0</TableCell>
        </Table>
        <View>单位: kg/m²</View>
        <View>
          注:
          {" "}
          BMI指标
          {" "}
          =
          {" "}
          体重/身高的平方
        </View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生肺活量评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, 3400, 3450], [95, 3350, 3400], [90, 3300, 3350]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, 3150, 3200], [80, 3000, 3050]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, 2900, 2950], [76, 2800, 2850], [74, 2700, 2750], [72, 2600, 2650], [70, 2500, 2550], [68, 2400, 2450], [66, 2300, 2350], [64, 2200, 2250], [62, 2100, 2150], [60, 2000, 2050]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, 1960, 2010], [40, 1920, 1970], [30, 1880, 1930], [20, 1840, 1890], [10, 1800, 1850]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>单位: 毫升</View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生立定跳远评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, 207, 208], [95, 201, 202], [90, 195, 196]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, 188, 189], [80, 181, 182]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, 178, 179], [76, 175, 176], [74, 172, 173], [72, 169, 170], [70, 166, 167], [68, 163, 164], [66, 160, 161], [64, 157, 158], [62, 154, 155], [60, 151, 152]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, 146, 147], [40, 141, 142], [30, 136, 137], [20, 131, 132], [10, 126, 127]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>单位: 厘米</View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生坐位体前屈评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, 25.8, 26.3], [95, 24.0, 24.4], [90, 22.2, 22.4]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, 20.6, 21.0], [80, 19.0, 19.5]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, 17.7, 18.2], [76, 16.4, 16.9], [74, 15.1, 15.6], [72, 13.8, 14.3], [70, 12.5, 13.0], [68, 11.2, 11.7], [66, 9.9, 10.4], [64, 8.6, 9.1], [62, 7.3, 7.8], [60, 6.0, 6.5]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, 5.2, 5.7], [40, 4.4, 4.9], [30, 3.6, 4.1], [20, 2.8, 3.3], [10, 2.0, 2.5]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>单位: 厘米</View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生50米跑评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, 7.5, 7.4], [95, 7.6, 7.5], [90, 7.7, 7.6]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, 8.0, 7.9], [80, 8.3, 8.2]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, 8.5, 8.4], [76, 8.7, 8.6], [74, 8.9, 8.8], [72, 9.1, 9.0], [70, 9.3, 9.2], [68, 9.5, 9.4], [66, 9.7, 9.6], [64, 9.9, 9.8], [62, 10.1, 10.0], [60, 10.3, 10.2]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, 10.5, 10.4], [40, 10.7, 10.6], [30, 10.9, 10.8], [20, 11.1, 11.0], [10, 11.3, 11.2]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>单位: 秒</View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生800米跑评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, "3:18", "3:16"], [95, "3:24", "3:22"], [90, "3:30", "3:28"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell key={`0-${i}-${j}`}>
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, "3:37", "3:35"], [80, "3:44", "3:42"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell key={`1-${i}-${j}`}>
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, "3:49", "3:47"], [76, "3:54", "3:52"], [74, "3:59", "3:57"], [72, "4:04", "4:02"], [70, "4:09", "4:07"], [68, "4:14", "4:12"], [66, "4:19", "4:17"], [64, "4:24", "4:22"], [62, "4:29", "4:27"], [60, "4:34", "4:32"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell key={`2-${i}-${j}`}>
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, "4:44", "4:42"], [40, "4:54", "4:52"], [30, "5:04", "5:02"], [20, "5:14", "5:12"], [10, "5:24", "5:22"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell key={`3-${i}-${j}`}>
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}
        </Table>
        <View>单位: 分'秒"</View>
        <Table cols={3}>
          <TableHeaderCell>加分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          {[[10, -50, -50], [9, -45, -45], [8, -40, -40], [7, -35, -35], [6, -30, -30], [5, -25, -25], [4, -20, -20], [3, -15, -15], [2, -10, -10], [1, -5, -5]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell key={`${i}-${j}`}>
                {j > 0 ? `${cell}"` : cell}
              </TableCell>
            )),
          )}
        </Table>
        <View>
          注:
          {" "}
          学生成绩超过100分后,
          {" "}
          以减少的秒数对应分数进行加分
        </View>
      </View>

      <View className="flex flex-col gap-sm">
        <View className="text-2xl text-highlight text-bold flex justify-center">
          女生一分钟仰卧起坐评分表
        </View>
        <Table cols={4}>
          <TableHeaderCell>等级</TableHeaderCell>
          <TableHeaderCell>单项得分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          <LevelCell level="excellent" span={3}>优秀</LevelCell>
          {[[100, 56, 57], [95, 54, 55], [90, 52, 53]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="good" span={2}>良好</LevelCell>
          {[[85, 49, 50], [80, 46, 47]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="pass" span={10}>及格</LevelCell>
          {[[78, 44, 45], [76, 42, 43], [74, 40, 41], [72, 38, 39], [70, 36, 37], [68, 34, 35], [66, 32, 33], [64, 30, 31], [62, 28, 29], [60, 26, 27]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <LevelCell level="fail" span={5}>不及格</LevelCell>
          {[[50, 24, 25], [40, 22, 23], [30, 20, 21], [20, 18, 19], [10, 16, 17]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>单位: 次</View>
        <Table cols={3}>
          <TableHeaderCell>加分</TableHeaderCell>
          <TableHeaderCell>大一/大二</TableHeaderCell>
          <TableHeaderCell>大三/大四</TableHeaderCell>

          {[[10, 13, 13], [9, 12, 12], [8, 11, 11], [7, 10, 10], [6, 9, 9], [5, 8, 8], [4, 7, 7], [3, 6, 6], [2, 4, 4], [1, 2, 2]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <View>
          注:
          {" "}
          学生成绩超过100分后,
          {" "}
          以超过的次数对应分数进行加分
        </View>
      </View>
    </View>
  )
}
