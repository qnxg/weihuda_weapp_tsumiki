import type { FaqObject } from "@/pages/feedback/components/faq-data"
import { Image, Input, Textarea, View } from "@tarojs/components"
import Taro, { useRouter } from "@tarojs/taro"
import { useState } from "react"
import { api } from "@/apis"
import { Card, CardContent } from "@/components/card"
import { Icon } from "@/components/icon"
import { MyButton } from "@/components/my-button"
import { Overlay, Popup } from "@/components/overlay"
import { Page, PageContent } from "@/components/page"
import { Faq } from "@/pages/feedback/components/faq"
import CheckIcon from "@/static/common/check.svg"
import GroupQrcode from "@/static/feedback/group-qrcode.png"
import UploadIcon from "@/static/feedback/upload.svg"
import { navigate } from "@/utils/navigate"

/**
 * @description 意见反馈页
 * - 已登录: 联系方式(选填) + 描述(必填) + 图片(选填)
 * - 未登录(noAuth=1): 学号(必填) + 联系方式(必填) + 描述(必填), 不支持图片
 *
 * TODO: 已登录的图片上传逻辑暂未处理, 目前选择图片仅供 UI 行为预览
 */
export default function Feedback() {
  const router = useRouter()
  const noAuth = router.params.noAuth === "1"

  const [stuId, setStuId] = useState("")
  const [contact, setContact] = useState("")
  const [desc, setDesc] = useState("")
  // TODO: 选择的本地图片临时路径, 仅用于预览, 上传功能待接入
  const [imgPath, setImgPath] = useState<string | null>(null)
  // 是否已提交成功, 成功后切换到成功页
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<FaqObject | null>(null)

  const handleChooseImg = () => {
    void Taro.chooseImage({
      count: 1,
      success(res) {
        setImgPath(res.tempFilePaths[0] ?? null)
      },
    })
  }

  const handleSubmit = async () => {
    if (submitting)
      return

    if (noAuth && stuId.trim().length === 0) {
      await Taro.showToast({ title: "请填写学号", icon: "none" })
      return
    }
    if (noAuth && contact.trim().length === 0) {
      await Taro.showToast({ title: "请填写联系方式", icon: "none" })
      return
    }
    if (desc.trim().length === 0) {
      await Taro.showToast({ title: "请填写反馈内容", icon: "none" })
      return
    }

    setSubmitting(true)
    await Taro.showLoading({ title: "正在提交" })
    try {
      if (noAuth) {
        await api.feedback.postNoAuth({
          stu_id: stuId.trim(),
          contact: contact.trim(),
          description: desc.trim(),
        })
      }
      else {
        // TODO: 图片上传待接入. 接入后先 api.img.upload(imgPath) 获取图片 id 再作为 img 提交
        await api.feedback.post({
          contact: contact.trim(),
          description: desc.trim(),
          img: null,
        })
      }
      setSubmitted(true)
    }
    catch {
      await Taro.showToast({ title: "提交失败", icon: "none" })
    }
    finally {
      Taro.hideLoading()
      setSubmitting(false)
    }
  }

  return (
    <Page>
      <PageContent className="h-full">
        {submitted
          ? (
              <View className="p-3xl flex flex-col items-center justify-center gap">
                <View className="size-l-md rounded-full bg-success flex center">
                  <Icon
                    className="size-xl"
                    src={CheckIcon}
                  />
                </View>
                <View className="text-xl text-bold">反馈提交成功</View>
                <View className="text-muted text-center">感谢你的反馈，我们会尽快查看并处理</View>

                <Card className="w-full my-md">
                  <CardContent className="flex flex-col items-center gap-md p">
                    <View className="text-lg text-bold">加入交流群</View>
                    <View className="text-muted text-md">欢迎加群交流，让问题反馈更快解决</View>
                    <Image
                      style={{ width: "75%" }}
                      src={GroupQrcode}
                      mode="widthFix"
                    />
                  </CardContent>
                </Card>

                <MyButton
                  active
                  className="w-full p flex center text-xl rounded-sm"
                  onClick={() => Taro.navigateBack()}
                >
                  完成
                </MyButton>
              </View>
            )
          : (
              <View className="flex flex-col gap p">
                {!noAuth && (
                  <View className="bg-subtle rounded-sm p text-sm">
                    <View className="text-primary">优质反馈或建议被采纳后，可获得一定的积分奖励。</View>
                  </View>
                )}

                {noAuth && (
                  <Card>
                    <CardContent className="flex flex-col gap p">
                      <View className="text-bold">学号</View>
                      <Input
                        className="flex-1"
                        value={stuId}
                        placeholder="请输入学号（必填）"
                        onInput={e => setStuId(e.detail.value)}
                      />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="flex flex-col gap p">
                    <View className="text-bold">联系方式</View>
                    <Input
                      className="flex-1"
                      value={contact}
                      placeholder={noAuth ? "电子邮箱地址（必填）" : "电子邮箱地址（选填）"}
                      onInput={e => setContact(e.detail.value)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex flex-col gap p">
                    <View className="text-bold">详细描述</View>
                    <Textarea
                      className="flex-1"
                      value={desc}
                      placeholder="请填写描述信息（必填）"
                      style={{ minHeight: "100px" }}
                      onInput={e => setDesc(e.detail.value)}
                    />
                    {!noAuth && (
                      <View
                        className="flex flex-col items-center justify-center gap-xs rounded-sm p border border-divider"
                        style={{ borderStyle: "dashed" }}
                        onClick={() => handleChooseImg()}
                      >
                        {imgPath
                          ? (
                              <View
                                className="w-full relative overflow-hidden rounded-sm"
                                style={{ height: "200px" }}
                              >
                                <Image
                                  className="w-full h-full"
                                  src={imgPath}
                                  mode="aspectFill"
                                  onClick={(e) => {
                                    // 阻止冒泡到外层上传区, 否则 handleChooseImg 会触发两次
                                    e.stopPropagation()
                                    handleChooseImg()
                                  }}
                                />
                                <View
                                  className="absolute bg-shadow rounded-full px-md py-sm flex center"
                                  style={{ top: "12px", right: "12px" }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    void Taro.previewImage({ urls: [imgPath] })
                                  }}
                                >
                                  <View className="text-reverse text-md">查看原图</View>
                                </View>
                              </View>
                            )
                          : (
                              <>
                                <Icon
                                  className="size-sm"
                                  src={UploadIcon}
                                />
                                <View className="text-sm text-muted">上传图片能帮助程序猿更好地解决问题</View>
                              </>
                            )}
                      </View>
                    )}
                  </CardContent>
                </Card>

                <MyButton
                  active
                  className="p flex center text-xl rounded-sm"
                  onClick={() => handleSubmit()}
                >
                  提交
                </MyButton>

                {!noAuth && (
                  <View className="flex center py-sm">
                    <View
                      className="text-primary underline"
                      onClick={() => navigate("/pages/feedback-history/index")}
                    >
                      反馈历史
                    </View>
                  </View>
                )}

                <Card>
                  <CardContent className="p">
                    <Faq onSelect={setSelectedFaq} />
                  </CardContent>
                </Card>
              </View>
            )}
      </PageContent>

      {selectedFaq && (
        <Overlay>
          <Popup
            isLoading={false}
            title={selectedFaq.q}
            onClose={() => setSelectedFaq(null)}
          >
            <View
              className="flex flex-col gap p"
              style={{ paddingBottom: "80px" }}
            >
              <View style={{ whiteSpace: "pre-wrap" }}>{selectedFaq.a}</View>
            </View>
          </Popup>
        </Overlay>
      )}
    </Page>
  )
}
