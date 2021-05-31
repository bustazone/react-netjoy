import ServiceClient from '../base/ServiceClient'
import type { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import type { NetClientConstructor, NetClientConfigWithID } from '../base/CommonTypes'
import { adaptRequestFromReduxAction } from './Redux.Utils'
import { ReduxActionInterface, ReduxCallObjectInterfaceLiteral } from './ReduxRequestAction.Types'
import { RequestInterceptorListType } from '../base/RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from '../base/ResponseInterceptorUtils.Types'

export function getServiceClientMiddleware<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
  baseUrl: string,
  baseHeaders?: { [key: string]: string },
  debugPrint?: boolean,
  timeoutMillis?: number,
  requestInterceptorList?: (
    getState: () => StateType,
    next: Dispatch,
  ) => RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
  responseInterceptorList?: (
    getState: () => StateType,
    next: Dispatch,
  ) => ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
): Middleware<{}, StateType> {
  return (api: MiddlewareAPI<Dispatch, StateType>) => (next: Dispatch) => (action: AnyAction) => {
    if (!action) return

    if (action.type !== ReduxCallObjectInterfaceLiteral) {
      next(action)
      return
    }

    const middleware = new ServiceClient(
      netClientCtor,
      baseUrl,
      api.getState,
      baseHeaders,
      requestInterceptorList ? requestInterceptorList(api.getState, next) : undefined,
      responseInterceptorList ? responseInterceptorList(api.getState, next) : undefined,
      debugPrint,
      timeoutMillis,
    )
    middleware.executeRequest(
      adaptRequestFromReduxAction<StateType, any, any>(api.getState, next, <ReduxActionInterface<StateType, any, any>>action),
    )
  }
}

export const loggerMiddleware: Middleware = <S>(api: MiddlewareAPI<Dispatch, S>) => (next: Dispatch) => <A extends Action>(
  action: A,
): A => {
  console.log('Before')
  const result = next(action)
  console.log(api.getState()) // Can use: api.getState()
  console.log('After') // Can use: api.getState()
  return result
}
