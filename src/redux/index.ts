import * as MiddlewareFuncs from './NetworkMiddleware'
import * as ReduxTypes from './Types'
import * as ReduxUtils from './Redux.Utils'

export const getServiceClientMiddleware = MiddlewareFuncs.getServiceClientMiddleware
export const loggerMiddleware = MiddlewareFuncs.loggerMiddleware
export const adaptRequestFromReduxAction = ReduxUtils.adaptRequestFromReduxAction
export type ActionNJ<StateType> = ReduxTypes.ActionNJ<StateType>
export type OutActionStarted = ReduxTypes.OutActionStarted
export type OutActionSuccess<ResponseType> = ReduxTypes.OutActionSuccess<ResponseType>
export type OutActionFailure<ErrorType> = ReduxTypes.OutActionFailure<ErrorType>
export type OutAction = ReduxTypes.OutAction
export type DispatchNJ = ReduxTypes.DispatchNJ
