import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  container: ViewStyle
  innerContainer: ViewStyle
  trackContainer: ViewStyle
  pointerContainer: ViewStyle
  trackCompletedContainer: ViewStyle
  trackPendingContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row'
  },
  innerContainer: {
    flexDirection: 'row'
  },
  trackContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  pointerContainer: {
    position: 'absolute'
  },
  trackCompletedContainer: {
    overflow: 'hidden',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 0,
    top: 0
  },
  trackPendingContainer: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0
  }
})

export default styles
