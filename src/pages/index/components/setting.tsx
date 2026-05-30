import { MyButton } from "@/components/my-button"

export function Setting() {
  return (
    <MyButton
      className="my bg p flex center rounded-sm text-primary"
      to="/setting/pages/index-card/index"
    >
      设置卡片
    </MyButton>
  )
}
