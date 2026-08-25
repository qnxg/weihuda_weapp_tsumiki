export const BG_COLOR = [
  "#E6F4FF",
  "#FDEBDD",
  "#DEFBF7",
  "#EEEDFF",
  "#FCEBCD",
  "#FFEFF0",
  "#EAF2FF",
  "#FFEEF8",
  "#FAEDFF",
  "#FFF9C9",
]

export const FONT_COLOR = [
  "#08A0E2",
  "#E97055",
  "#3CB3C9",
  "#7D7CDD",
  "#FF9900",
  "#DD5D75",
  "#5D8FF8",
  "#EC6DB8",
  "#B769DF",
  "#CBA715",
]

/**
 * @description 预设色名, 与 BG_COLOR / FONT_COLOR 一一对应
 */
export const COLOR_NAMES = [
  "blue",
  "orange",
  "cyan",
  "purple",
  "amber",
  "pink",
  "indigo",
  "magenta",
  "violet",
  "gold",
] as const

/**
 * @description 预设色名 → 背景色 + 前景色
 */
export const COLOR_MAP = {
  blue: { bg: BG_COLOR[0], font: FONT_COLOR[0] },
  orange: { bg: BG_COLOR[1], font: FONT_COLOR[1] },
  cyan: { bg: BG_COLOR[2], font: FONT_COLOR[2] },
  purple: { bg: BG_COLOR[3], font: FONT_COLOR[3] },
  amber: { bg: BG_COLOR[4], font: FONT_COLOR[4] },
  pink: { bg: BG_COLOR[5], font: FONT_COLOR[5] },
  indigo: { bg: BG_COLOR[6], font: FONT_COLOR[6] },
  magenta: { bg: BG_COLOR[7], font: FONT_COLOR[7] },
  violet: { bg: BG_COLOR[8], font: FONT_COLOR[8] },
  gold: { bg: BG_COLOR[9], font: FONT_COLOR[9] },
} as const
