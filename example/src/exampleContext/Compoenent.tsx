import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ExampComp: FunctionComponent<{
  data: string
  info: string
  func: () => void
  setInfop: (i: string) => void
}> = value => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          value.func()
        }}>
        <Text>{value.data}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          value.setInfop(value.info + 'x')
        }}>
        <Text>{value.info}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ExampComp
