import React, { FunctionComponent, PropsWithChildren, useState } from 'react'
import { Alert } from 'react-native'
import { ContextDataType } from './component_context_1.types'

const initial: ContextDataType = {
  data: 'data',
  func: () => {
    Alert.alert('hhhhhhh')
  },
  info: '',
  setInfop: (_: string) => {},
}

export const Context = React.createContext<ContextDataType>(initial)

const ExampHandler: FunctionComponent<PropsWithChildren<{}>> = props => {
  const [info, setInfo] = useState('info')
  function setInfop(i: string) {
    console.log('setInfop')
    setInfo(i)
  }

  return <Context.Provider value={{ ...initial, info, setInfop }}>{props.children}</Context.Provider>
}

export default ExampHandler
