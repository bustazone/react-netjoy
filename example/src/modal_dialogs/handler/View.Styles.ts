import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  container: ViewStyle
  childrenContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: { flex: 1, backgroundColor: 'transparent' },
  childrenContainer: { flex: 1, backgroundColor: 'transparent' },
})

export default styles
