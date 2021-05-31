import React, { FunctionComponent } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { ExampCompPropsType } from './View.Types';

const ExampComp: FunctionComponent<ExampCompPropsType> = value => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          value.func()
        }}
      >
        <Text>{value.data}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          value.setInfop('x')
        }}
      >
        <Text>{value.info}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ExampComp
