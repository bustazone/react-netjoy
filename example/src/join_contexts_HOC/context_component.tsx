import React, { FunctionComponent, useContext } from 'react'
import { combineStatesComponentType } from './types'

export function createComponent<DataType>(componentId: string, context: React.Context<DataType>): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const ctx: DataType = useContext(context)
      const innerProps = {
        [componentId]: ctx,
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}
