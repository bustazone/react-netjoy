import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './App.Styles'
import ExampHandler2 from './exampleContext/component_context_2'
import ExampHandler from './exampleContext/component_context_1'
import ComponentLogic from './exampleContext'
import { Provider } from 'react-redux'
import { store } from './redux'

export default function App() {
  return (
    <Provider store={store}>
      <ExampHandler>
        <ExampHandler2>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => {}}>
              <Text>Device name:</Text>
            </TouchableOpacity>
            <ComponentLogic initialInput={'dsdfsdf'} />
          </View>
        </ExampHandler2>
      </ExampHandler>
    </Provider>
  )
}
