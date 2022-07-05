import { InferableComponentEnhancerWithProps } from 'react-redux';
import React, { FunctionComponent, useMemo } from 'react';
import { combineStatesComponentType } from './types';

export function createComponent(
  componentId: string,
  reduxConnect: InferableComponentEnhancerWithProps<any, any>,
): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const Comp: FunctionComponent = (props: any) => {
        const innerProps = {
          [componentId]: props,
        }
        return <Component {...ownProps} {...innerProps} />
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const ConnectComp = useMemo(() => reduxConnect(Comp), [])
      return <ConnectComp />
    }
  }
}
