import React, { FunctionComponent } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

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
          console.log('dddd0')
          value.func()
        }}
      >
        <Text>{value.data}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('dddd1')
          value.setInfop('x')
        }}
      >
        <Text>{value.info}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ExampComp
