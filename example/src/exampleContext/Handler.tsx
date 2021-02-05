import React, { FunctionComponent, useState } from 'react'
import { Alert } from 'react-native'
import {singleton} from "./jjj";

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
    setInfo(i)
    console.log('setInfop')
    console.log(singleton)
    singleton.add(i)
    console.log(singleton)
  }

  return (
    <Context.Provider value={{ ...initial, info, setInfop }}>{props.children}</Context.Provider>
  )
}

export default ExampHandler
