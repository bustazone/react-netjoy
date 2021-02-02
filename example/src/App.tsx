import * as React from 'react'
import { View, Text } from 'react-native'
import { axios } from 'react-netjoy'
import styles from './App.Styles'

export default function App() {
  axios.getEmptyRequest()
  return (
    <View style={styles.container}>
      <Text>Device name: </Text>
    </View>
  )
}
