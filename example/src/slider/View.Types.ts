import { StyleProp, ViewStyle } from 'react-native'

export type SliderPropsType = {
  initialValue?: number
  steps?: number
  snapStepOnMove?: boolean
  onValueChange: (value: number) => void
  onProgress?: (value: number) => void
  renderPointer: (currentValue: number) => Element
  renderTrackCompleted: () => Element
  renderTrackPending: () => Element
  onDragStarts?: () => void
  onDragEnds?: () => void
  onTapStart?: () => void
  onTapEnds?: () => void
  style?: StyleProp<ViewStyle>
}
