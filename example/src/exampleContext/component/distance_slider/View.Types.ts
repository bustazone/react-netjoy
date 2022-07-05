import { StyleProp, ViewStyle } from 'react-native'

export type DistanceSliderViewProps = {
  initialValue?: number
  onValueChange: (value: number) => void
  style?: StyleProp<ViewStyle>
}
