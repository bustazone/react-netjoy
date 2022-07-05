import React, { FunctionComponent, useState } from 'react'
import { combineStatesComponentType } from './types'

export type DataType<StateType> = {
  state: StateType
  setState: (state: StateType) => void
}

export function createComponent<StateType>(componentId: string, initialState: StateType): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const [state, setState] = useState<StateType>(initialState)
      const innerProps = {
        [componentId]: { state, setState },
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}
