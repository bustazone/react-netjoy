import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  container: ViewStyle
  safeAreaContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: { flex: 1 },
  safeAreaContainer: { flex: 1 }
})

export default styles
