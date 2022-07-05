import React, { FunctionComponent, useState } from 'react'
import { combineStatesComponentType } from './types'
import { Singleton } from '../global_data_persistent_singleton'

export type DateType<StateType> = {
  state: StateType
  setState: (data: StateType, callback?: () => void) => void
  resetState: (callback?: () => void) => void
}

export function createComponent<StateType>(componentId: string, singleton: Singleton<StateType>): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const [state, setState] = useState<StateType | undefined>(singleton.getInstance().get())
      function setStateCompose(data: StateType, callback?: () => void) {
        setState(data)
        singleton.getInstance().set(data, callback)
      }
      function resetStateCompose(callback?: () => void) {
        setState(singleton.getInstance().initialData)
        singleton.getInstance().reset(callback)
      }
      const innerProps = {
        [componentId]: { state, setState: setStateCompose, resetState: resetStateCompose },
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}
