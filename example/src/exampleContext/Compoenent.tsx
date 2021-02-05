import React, { FunctionComponent } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import {singleton} from "./jjj";

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
          value.setInfop(singleton.get() + 'x')
        }}>
        <Text>{value.info}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ExampComp
