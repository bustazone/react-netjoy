import React, { FunctionComponent } from 'react'
import { combineStatesComponentType } from './types'

export function combineStates<ComposedInputType = any, OwnPropsType = any, OuputPropsType = any>(
  Component: FunctionComponent<OuputPropsType>,
  mapProps: (ownProps: ComposedInputType & OwnPropsType) => OuputPropsType,
  components: combineStatesComponentType[],
): FunctionComponent<OwnPropsType> {
  const Comp: FunctionComponent<ComposedInputType & OwnPropsType> = (props: ComposedInputType & OwnPropsType) => {
    return <Component {...mapProps(props)} />
  }
  return (ownProps: OwnPropsType) => {
    const ResultComponent = components.reduce<FunctionComponent<any>>((acc, WrapComponent) => {
      return WrapComponent(acc)
    }, Comp)
    return <ResultComponent {...ownProps} />
  }
}
