import { LocalReducerEventProps, LocalReducerState } from './component_reducer.types'
import React from 'react'

const SET_COUNTER = 'SET_COUNTER'

export const dispatchToProps = (dispatch: React.Dispatch<any>): LocalReducerEventProps => ({
  setCounter: value =>
    dispatch({
      type: SET_COUNTER,
      value,
    }),
})

export const initState: LocalReducerState = {
  counter: false,
}

export const component_reducer = (state: LocalReducerState = initState, action: any) => {
  switch (action.type) {
    case SET_COUNTER:
      return { ...state, counter: action.value }
    default:
      return state
  }
}
