import React, { FunctionComponent, useState } from 'react'
import { Alert } from 'react-native'

export type ContextDataType = {
  data: string
  func: () => void
  info: string
  setInfop: (_: string) => void
}

const initial: ContextDataType = {
  data: 'data',
  func: () => {
    Alert.alert('hhhhhhh')
  },
  info: '',
  setInfop: (_: string) => {},
}

export const Context = React.createContext<ContextDataType>(initial)
const ExampHandler: FunctionComponent<{}> = props => {
  const [info, setInfo] = useState('info')
  function setInfop(i: string) {
    console.log('setInfop')
    setInfo(i)
  }

  return <Context.Provider value={{ ...initial, info, setInfop }}>{props.children}</Context.Provider>
}

export default ExampHandler
