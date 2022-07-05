import React, { FunctionComponent } from 'react'
import { Text, TouchableOpacity } from 'react-native'

const ModalExampView: FunctionComponent<{ hide: () => void }> = ({ hide }: { hide: () => void }) => {
  return (
    <TouchableOpacity style={{ width: 100, height: 100, backgroundColor: 'red' }} onPress={hide}>
      <Text>dsdfsdfs</Text>
    </TouchableOpacity>
  )
}

export default ModalExampView
