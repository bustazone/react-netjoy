import React, { ComponentType, FunctionComponent } from 'react'
import { SafeAreaView, View } from 'react-native'
import styles from './index.Styles'

type ThingsProps = {
  color: string
}

export function withSafeArea<P>(
  WrappedComponent: ComponentType<P>,
  options: ThingsProps = { color: '#FFF' }
): FunctionComponent<P> {
  return (props: P) => {
    return (
      <View style={{ ...styles.container, backgroundColor: options.color }} pointerEvents={'box-none'}>
        <SafeAreaView style={styles.safeAreaContainer} pointerEvents={'box-none'}>
          <WrappedComponent {...props} />
        </SafeAreaView>
      </View>
    )
  }
}
