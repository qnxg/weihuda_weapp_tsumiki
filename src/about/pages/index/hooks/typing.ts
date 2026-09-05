import type { Reducer } from "react"
import { useEffect, useMemo, useReducer, useRef } from "react"

type Phase = "init" | "typing" | "printed" | "deleting"

interface State {
  phase: Phase
  text: string
  nextText: string | null
  i: number
}

type Action
  = | { type: "TICK" }
    | { type: "SET_TEXT", text: string }

/**
 * @description useTyping 的 reducer 状态机
 * ## 状态说明
 *   1. init: 初始等待 - i 从负值递增到 0, displayed 为空, timer = typingSpeed
 *   2. typing: 打字中 - i 从 0 递增到 text.length, displayed = text.slice(0, i), timer = typingSpeed
 *   3. printed: 已打完 - displayed 为满字, 无 timer
 *   4. deleting: 清除中 - i 从当前长度递减到 0, displayed = text.slice(0, i), timer = deletingSpeed
 * ## Action 说明
 *   1. TICK: 推进 i, 满条件时触发 phase 跳转
 *   2. SET_TEXT: text prop 变化时触发, 按当前 phase 决定是否进入 deleting; text 未变则 no-op
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TICK":
      switch (state.phase) {
        case "init":
          if (state.i < 0) {
            return { ...state, i: state.i + 1 }
          }
          return {
            ...state,
            phase: "typing",
            i: 0,
          }
        case "typing":
          if (state.i < state.text.length) {
            return { ...state, i: state.i + 1 }
          }
          return {
            ...state,
            phase: "printed",
            i: state.text.length,
          }
        case "deleting":
          if (state.i > 0) {
            return { ...state, i: state.i - 1 }
          }
          if (state.nextText === null) {
            return state
          }
          return {
            ...state,
            phase: "typing",
            text: state.nextText,
            nextText: null,
            i: 0,
          }
        default:
          return state
      }
    case "SET_TEXT":
      if (action.text === state.text || action.text === state.nextText) {
        return state
      }
      switch (state.phase) {
        case "init":
          return {
            ...state,
            phase: "typing",
            text: action.text,
            i: 0,
          }
        case "typing":
        case "printed":
          return {
            ...state,
            phase: "deleting",
            nextText: action.text,
          }
        case "deleting":
          return {
            ...state,
            nextText: action.text,
          }
        default:
          return state
      }
    default:
      return state
  }
}

/**
 * @description useTyping 配置项
 * @property {number} [initialDelay=15] - 初始等待 tick 数, 每 tick = typingSpeed ms
 * @property {number} [typingSpeed=100] - 打字 / 初始等待的 tick 间隔 (ms)
 * @property {number} [deletingSpeed=50] - 清除的 tick 间隔 (ms)
 */
interface UseTypingOptions {
  initialDelay?: number
  typingSpeed?: number
  deletingSpeed?: number
}

/**
 * @description useTyping 返回值
 * @property {string} displayed - 当前展示的文本 (动画结果)
 * @property {Phase} phase - 当前阶段
 * @property {boolean} isAnimating - 是否在动画中 (init / typing / deleting; printed 为 false)
 */
interface UseTypingResult {
  displayed: string
  phase: Phase
  isAnimating: boolean
}

/**
 * @description 打字机效果 Hook
 * @param {string} text - 要展示的文本
 * @param {UseTypingOptions} [options] - 配置项
 */
export function useTyping(
  text: string,
  options: UseTypingOptions = {},
): UseTypingResult {
  const { initialDelay = 15, typingSpeed = 100, deletingSpeed = 50 } = options

  const [state, dispatch] = useReducer<Reducer<State, Action>, string>(
    reducer,
    text,
    initial => ({
      phase: "init",
      text: initial,
      nextText: null,
      i: -initialDelay,
    }),
  )

  const displayed = useMemo(() => {
    if (state.phase === "printed") {
      return state.text
    }
    if (state.phase === "init" || state.i <= 0) {
      return ""
    }
    return state.text.slice(0, state.i)
  }, [state.phase, state.text, state.i])

  const isAnimating = useMemo(() => state.phase !== "printed", [state.phase])

  // 用 ref 缓存 speeds, 避免 options 引用变化导致 timer 重复挂载
  const speedsRef = useRef({ typingSpeed, deletingSpeed })
  speedsRef.current = { typingSpeed, deletingSpeed }

  useEffect(() => {
    if (state.phase === "printed") {
      return
    }
    const speeds = speedsRef.current
    const interval = state.phase === "deleting" ? speeds.deletingSpeed : speeds.typingSpeed
    const timer = setInterval(() => {
      dispatch({ type: "TICK" })
    }, interval)
    return () => clearInterval(timer)
  }, [state.phase, dispatch])

  // text prop 变化时同步到状态机
  useEffect(() => {
    dispatch({ type: "SET_TEXT", text })
  }, [text, dispatch])

  return {
    displayed,
    phase: state.phase,
    isAnimating,
  }
}
