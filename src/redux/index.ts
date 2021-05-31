import * as MiddlewareFuncs from './NetworkMiddleware'
import * as ReduxTypes from './Types'
import * as ReduxUtils from './Redux.Utils'

export const getServiceClientMiddleware = MiddlewareFuncs.getServiceClientMiddleware
export const loggerMiddleware = MiddlewareFuncs.loggerMiddleware
export const adaptRequestFromReduxAction = ReduxUtils.adaptRequestFromReduxAction
export const getEmptyRequestAction = ReduxUtils.getEmptyRequestAction
export type OutActionStarted = ReduxTypes.OutActionStarted
export type OutActionSuccess<ResponseType> = ReduxTypes.OutActionSuccess<ResponseType>
export type OutActionFailure<ErrorType> = ReduxTypes.OutActionFailure<ErrorType>
