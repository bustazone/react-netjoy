import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './App.Styles'
import ExampHandler2 from './exampleContext/component_context_2'
import ExampHandler from './exampleContext/component_context_1'
import ModalDialogHandler from './modal_dialogs'
import ComponentLogic from './exampleContext'
import { Provider } from 'react-redux'
import { store } from './redux'
import { useEffect } from 'react'
import { SingletonX } from './exampleContext/example_singleton'
import SingletonHandler from './global_data_persistent_singleton/handler'

export default function App() {
  useEffect(() => {
    async function fetchData() {
      SingletonX.getInstance().restore()
    }
    fetchData()
  }, [])
  return (
    <SingletonHandler singletons={[SingletonX]}>
      <Provider store={store}>
        <ExampHandler>
          <ExampHandler2>
            <ModalDialogHandler>
              <View style={styles.container}>
                <TouchableOpacity onPress={() => {}}>
                  <Text>Device name:</Text>
                </TouchableOpacity>
                <ComponentLogic initialInput={'dsdfsdf'} />
              </View>
            </ModalDialogHandler>
          </ExampHandler2>
        </ExampHandler>
      </Provider>
    </SingletonHandler>
  )
}
