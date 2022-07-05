import React, { FunctionComponent } from 'react'
import { combineStatesComponentType } from './types'

export type DataType = {
  value: string
  function: () => void
}

export function createComponent(componentId: string, fakePropName: string): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const ctx = {
        value: fakePropName + ' data',
        function: () => {
          console.log(fakePropName + ' data')
        },
      }
      const innerProps = {
        [componentId]: ctx,
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}
