export type ExampCompInputPropsType = {
  data: string | undefined
  info: string
}
export type ExampCompEventPropsType = {
  func: () => void
  setInfop: (i: string) => void
}
export type ExampCompPropsType = ExampCompInputPropsType & ExampCompEventPropsType
