import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Alert } from 'react-native'
import { Context2DataType } from './component_context_2.types';

const initial: Context2DataType = {
  data2: 'data',
  func2: () => {
    Alert.alert('22222')
  },
  info2: '',
  setInfop2: (_: string) => {},
}

export const Context2 = React.createContext(initial)

const ExampHandler: FunctionComponent<PropsWithChildren<{}>> = props => {
  const [info, setInfo] = useState('info2')
  function setInfop(i: string) {
    setInfo(i)
  }
  return (
    <Context2.Provider value={{ ...initial, info2: info, setInfop2: setInfop }}>
      {props.children}
    </Context2.Provider>
  )
}

export default ExampHandler
