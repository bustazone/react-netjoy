import { AnyAction } from 'redux'
import { ReduxActionInterface } from './ReduxRequestAction.Types'

export type ActionNJ<StateType> = AnyAction | OutAction | ReduxActionInterface<StateType, any, any>

export type OutActionStarted = {
  type: string
}

export type OutActionSuccess<ResponseType> = {
  type: string
  response: ResponseType
}

export type OutActionFailure<ErrorType> = {
  type: string
  error: ErrorType
}

export type OutAction = OutActionStarted | OutActionSuccess<any> | OutActionFailure<any>

interface Dispatch<S, A extends ActionNJ<S> = AnyAction> {
  <T extends A>(action: T): T
}

export type DispatchNJ = Dispatch<AnyAction>
