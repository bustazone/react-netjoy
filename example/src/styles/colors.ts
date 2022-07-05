type mainColorsType = {
  primary: string
  greenSaba: string
  orangeSaba: string
  grey: string
  greyDark: string
  greyMedium: string
  disabled: string
  background1: string
  background2: string
  alertBackground: string
  alerts: string
  warning: string
  white: string
  black: string
}

export const mainColors: mainColorsType = {
  primary: '#00828E',
  greenSaba: '#00A599',
  orangeSaba: '#FF5800',
  grey: '#546E7A',
  greyDark: '#3F4444',
  greyMedium: '#606060',
  disabled: '#CED7DB',
  background1: '#F4F4F4',
  background2: '#F9F9F9',
  alertBackground: '#253137',
  alerts: '#D32F2F',
  warning: '#FFC107',
  white: '#FFFFFF',
  black: '#000000'
}
export function getColorWithAlpha(color: string, alpha: number) {
  return getHexWithAlpha(color, alpha)
}
export function getHexWithAlpha(hex: string, alpha: number) {
  if (!alpha && alpha !== 0) return hex

  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
