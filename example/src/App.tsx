import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './App.Styles'
import ExampHandler2 from './exampleContext/Handler2'
import ExampHandler from './exampleContext/Handler'
import ComponentLogic from './exampleContext/ComponentLogic'
import ExampComp from './exampleContext/Compoenent'
import { singleton } from "./exampleContext/jjj";

export default function App() {
  return (
    <ExampHandler>
      <ExampHandler2>
        <View style={styles.container}>
          <Text>Device name: </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('singleton().todos')
              console.log(singleton.get())
            }}
          >
            <Text>Device name:</Text>
          </TouchableOpacity>
          <ComponentLogic />
          <ExampComp data={'x'} func={() => {}} info={'y'} setInfop={() => {}} />
        </View>
      </ExampHandler2>
    </ExampHandler>
  )
}
