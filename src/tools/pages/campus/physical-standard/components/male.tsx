import { View } from "@tarojs/components"
import { od } from "@/utils/ohday"
import { Table, TableCell } from "./table"

export function Male() {
  return (
    <View className="flex flex-col gap p">
      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生体重指数(BMI)评分表(单位:kg/m²)
        </View>
        <Table cols={3}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">单项成绩</TableCell>

          <TableCell>正常</TableCell>
          <TableCell>100</TableCell>
          <TableCell>17.9-23.9</TableCell>

          <TableCell>低体重</TableCell>
          <TableCell style={{ gridRow: "span 2" }}>80</TableCell>
          <TableCell>≤ 17.8</TableCell>
          <TableCell>超重</TableCell>
          <TableCell>24.0-27.9</TableCell>

          <TableCell>肥胖</TableCell>
          <TableCell>60</TableCell>
          <TableCell>≥ 28.0</TableCell>
        </Table>
        <View>
          注:
          {" "}
          BMI指标
          {" "}
          =
          {" "}
          体重/身高的平方
          {" "}
          (kg/m²)
        </View>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生肺活量评分表(单位:毫升)
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, 5040, 5140], [95, 4920, 5020], [90, 4800, 4900]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, 4550, 4650], [80, 4300, 4400]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 10" }}>及格</TableCell>
          {[[78, 4180, 4280], [76, 4060, 4160], [74, 3940, 4040], [72, 3820, 3920], [70, 3700, 3800], [68, 3580, 3680], [66, 3460, 3560], [64, 3340, 3440], [62, 3220, 3320], [60, 3100, 3200]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, 2940, 3030], [40, 2780, 2860], [30, 2620, 2690], [20, 2460, 2520], [20, 2300, 2350]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生立定跳远评分表(单位:厘米)
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, 273, 275], [95, 268, 270], [90, 263, 265]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, 256, 258], [80, 248, 240]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 10" }}>及格</TableCell>
          {[[78, 244, 246], [76, 240, 242], [74, 236, 238], [72, 232, 234], [70, 228, 230], [68, 224, 226], [66, 220, 222], [64, 216, 218], [62, 212, 214], [60, 208, 210]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, 203, 205], [40, 198, 200], [30, 193, 195], [20, 188, 190], [10, 183, 185]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生坐位体前屈评分表(单位:厘米)
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, 24.9, 25.1], [95, 23.1, 23.3], [90, 21.3, 21.5]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, 19.5, 19.9], [80, 21.3, 21.5]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 10" }}>及格</TableCell>
          {[[78, 16.3, 16.8], [76, 14.9, 15.4], [74, 13.5, 14.0], [72, 12.1, 12.6], [70, 10.7, 11.2], [68, 9.3, 9.8], [66, 7.9, 8.4], [64, 6.5, 7.0], [62, 5.1, 5.6], [60, 3.7, 4.2]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, 2.7, 3.2], [40, 1.7, 2.2], [30, 0.7, 1.2], [20, -0.3, 0.2], [10, -1.3, -0.8]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生50米跑评分表(单位:秒)
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, 6.7, 6.6], [95, 6.8, 6.7], [90, 6.9, 6.8]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, 7.0, 6.9], [80, 7.1, 7.0]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 10" }}>及格</TableCell>
          {[[78, 7.3, 7.2], [76, 7.5, 7.4], [74, 7.7, 7.6], [72, 7.9, 7.8], [70, 8.1, 8.0], [68, 8.3, 8.2], [66, 8.5, 8.4], [64, 8.7, 8.6], [62, 8.9, 8.8], [60, 9.1, 9.0]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, 9.3, 9.2], [40, 9.5, 9.4], [30, 9.7, 9.6], [20, 9.9, 9.8], [10, 10.1, 10.0]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
      </View>

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生1000米跑评分表(单位:分'秒")
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, "3:17", "3:15"], [95, "3:22", "3:20"], [90, "3:27", "3:25"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell
                key={`0-${i}-${j}`}
              >
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, "3:34", "3:32"], [80, "3:42", "3:40"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell
                key={`1-${i}-${j}`}
              >
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <TableCell style={{ gridRow: "span 10" }}>及格</TableCell>
          {[[78, "3:47", "3:45"], [76, "3:52", "3:50"], [74, "3:57", "3:55"], [72, "4:02", "4:00"], [70, "4:07", "4:05"], [68, "4:12", "4:10"], [66, "4:17", "4:15"], [64, "4:22", "4:20"], [62, "4:27", "4:25"], [60, "4:32", "4:30"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell
                key={`2-${i}-${j}`}
              >
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, "4:52", "4:50"], [40, "5:12", "5:10"], [30, "5:32", "5:30"], [20, "5:52", "5:50"], [10, "6:12", "6:10"]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell
                key={`3-${i}-${j}`}
              >
                {j > 0 ? od(cell, "m:ss").p("m'ss\"") : cell}
              </TableCell>
            )),
          )}
        </Table>
        <Table cols={3}>
          <TableCell className="text-bold">加分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          {[[10, -35, -35], [9, -32, -32], [8, -29, -29], [7, -26, -26], [6, -23, -23], [5, -20, -20], [4, -16, -16], [3, -12, -12], [2, -8, -8], [1, -4, -4]].map((row, i) =>
            row.map((cell, j) => (
              <TableCell
                key={`${i}-${j}`}
              >
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

      <View className="flex flex-col">
        <View className="text-xl text-hightlight text-bold flex justify-center">
          男生引体向上评分表(单位:次)
        </View>
        <Table cols={4}>
          <TableCell className="text-bold">等级</TableCell>
          <TableCell className="text-bold">单项得分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          <TableCell style={{ gridRow: "span 3" }}>优秀</TableCell>
          {[[100, 19, 20], [95, 18, 19], [90, 17, 18]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`0-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 2" }}>良好</TableCell>
          {[[85, 16, 17], [80, 15, 16]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`1-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>及格</TableCell>
          {[[76, 14, 15], [72, 13, 14], [68, 12, 13], [64, 11, 12], [60, 10, 11]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`2-${i}-${j}`}>{cell}</TableCell>),
          )}

          <TableCell style={{ gridRow: "span 5" }}>不及格</TableCell>
          {[[50, 9, 10], [40, 8, 9], [30, 7, 8], [20, 6, 7], [10, 5, 6]].map((row, i) =>
            row.map((cell, j) => <TableCell key={`3-${i}-${j}`}>{cell}</TableCell>),
          )}
        </Table>
        <Table cols={3}>
          <TableCell className="text-bold">加分</TableCell>
          <TableCell className="text-bold">大一/大二</TableCell>
          <TableCell className="text-bold">大三/大四</TableCell>

          {[[10, 10, 10], [9, 9, 9], [8, 8, 8], [7, 7, 7], [6, 6, 6], [5, 5, 5], [4, 4, 4], [3, 3, 3], [2, 2, 2], [1, 1, 1]].map((row, i) =>
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
