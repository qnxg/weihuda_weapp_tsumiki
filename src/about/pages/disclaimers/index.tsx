import { Text, View } from "@tarojs/components"
import { Card, CardContent } from "@/components/card"
import { Page, PageContent } from "@/components/page"

export default function Disclaimers() {
  return (
    <Page>
      <PageContent fixed className="h-full">
        <View className="flex p">
          <Card className="w-full">
            <CardContent className="flex flex-col gap">
              {/* 大标题 */}
              <View className="text-3xl text-highlight text-bold flex center">
                免责声明
              </View>

              {/* 引导行 */}
              <View className="text-highlight">
                为使用微信小程序平台服务,&nbsp;
                你应当阅读并遵守《微信小程序平台服务条款》.
              </View>

              {/* 一. 协议的范围 */}
              <View className="flex flex-col gap-sm">
                <View className="text-xl text-highlight text-bold">一、协议的范围</View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">1.1</Text>
                  &nbsp;
                  本条款是你与腾讯之间关于你使用小程序服务所订立的协议. "用户"是指注册、登录、使用微信小程序的个人或组织.
                </View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">1.2</Text>
                  &nbsp;
                  微信用户使用小程序即成为该小程序的服务用户,&nbsp;
                  微信小程序可以通过小程序平台为相关用户提供应用服务.
                </View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">1.3</Text>
                  &nbsp;
                  小程序属于微信公众帐号,&nbsp;
                  在不与本条款冲突的情况下,&nbsp;
                  你应遵守《微信公众平台服务协议》等协议规则关于微信公众帐号的其他相关规定.
                </View>
              </View>

              {/* 二. 小程序注册 */}
              <View className="flex flex-col gap-sm">
                <View className="text-xl text-highlight text-bold">二、小程序注册</View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">2.1</Text>
                  &nbsp;
                  你在使用本服务前需要绑定个人信息. 微信小程序通过学号、个人门户密码,&nbsp;
                  教务系统密码(研究生为研究生信息管理系统密码)进行绑定注册.
                </View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">2.2</Text>
                  &nbsp;
                  用户在绑定完成后,&nbsp;
                  方可使用相关功能.
                </View>
              </View>

              {/* 三. 小程序使用 */}
              <View className="flex flex-col gap-sm">
                <View className="text-xl text-highlight text-bold">三、小程序使用</View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">3.1</Text>
                  &nbsp;
                  本服务信息来源于湖南大学教务系统以及个人门户信息,&nbsp;
                  一切信息以湖南大学教务系统以及个人门户信息为准.
                </View>
                <View>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Text className="text-highlight text-bold">3.2</Text>
                  &nbsp;
                  本小程序所提供的一切信息仅供参考,&nbsp;
                  不作为任何考核及评定(包括但不限于: 评奖评优)的依据.
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </PageContent>
    </Page>
  )
}
