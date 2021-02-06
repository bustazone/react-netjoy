import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './App.Styles'
import ExampHandler2 from './exampleContext/Handler2'
import ExampHandler from './exampleContext/Handler'
import ComponentLogic from './exampleContext/ComponentLogic'

export default function App() {
  return (
    <ExampHandler>
      <ExampHandler2>
        <View style={styles.container}>
          <Text>Device name: </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text>Device name:</Text>
          </TouchableOpacity>
          <ComponentLogic />
        </View>
      </ExampHandler2>
    </ExampHandler>
  )
}
