import * as middlewareFuncs from './NetworkMiddleware'
import * as ReduxTypes from './Types'

export const getServiceClientMiddleware = middlewareFuncs.getServiceClientMiddleware
export const loggerMiddleware = middlewareFuncs.loggerMiddleware
export type ActionNJ<StateType> = ReduxTypes.ActionNJ<StateType>
export type OutActionStarted = ReduxTypes.OutActionStarted
export type OutActionSuccess<ResponseType> = ReduxTypes.OutActionSuccess<ResponseType>
export type OutActionFailure<ErrorType> = ReduxTypes.OutActionFailure<ErrorType>
export type OutAction = ReduxTypes.OutAction
export type DispatchNJ = ReduxTypes.DispatchNJ
