import React, { Dispatch, FunctionComponent, Reducer, useReducer } from 'react';
import { combineStatesComponentType } from './types';

export function createComponent<ReducerStateType, ReducerActionsType>(
  componentId: string,
  reducer: Reducer<any, any>,
  initState: ReducerStateType,
  dispatchToProps: (dispatch: Dispatch<any>) => ReducerActionsType,
): combineStatesComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const [state, dispatch] = useReducer<typeof reducer>(reducer, initState)
      const innerProps = {
        [componentId]: { ...state, ...dispatchToProps(dispatch) },
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}
