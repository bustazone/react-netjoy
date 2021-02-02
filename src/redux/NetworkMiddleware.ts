import ServiceClient from '../base/ServiceClient'
import { Action, Middleware, MiddlewareAPI } from 'redux'
import {
  NetClientConstructor,
  ServiceClientInterface,
  NetClientConfigWithID,
  RequestInterceptorType,
  ResponseInterceptorType,
} from '../base/CommonTypes'
import { adaptCallToRedux } from './Redux.Utils'
import { ActionNJ, DispatchNJ } from './Types'
import { ReduxActionInterface, ReduxCallObjectInterfaceType } from './ReduxRequestAction.Types'
import { ServiceCallFromObject } from './ReduxRequestAction'

export function getServiceClientMiddleware<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  printDebug: boolean,
  checkConnectionLost?: () => boolean,
  requestInterceptorList?: (
    getState: () => StateType,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  ) => RequestInterceptorType<ConfigType, ErrorType>[],
  responseInterceptorList?: (
    getState: () => StateType,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  ) => ResponseInterceptorType<ResponseType, ErrorType>[],
): Middleware<any, any, DispatchNJ> {
  return (api: MiddlewareAPI<DispatchNJ, StateType>) => (next: DispatchNJ) => (action: ActionNJ<StateType>) => {
    if (!action) return

    if (action.type !== ReduxCallObjectInterfaceType.ActionType) {
      next(action)
      return
    }

    const middleware = new ServiceClient(
      netClientCtor,
      baseUrl,
      api.getState,
      baseHeaders,
      checkConnectionLost,
      requestInterceptorList ? requestInterceptorList(api.getState, next) : undefined,
      responseInterceptorList ? responseInterceptorList(api.getState, next) : undefined,
      printDebug,
    )
    middleware.executeRequest(
      ServiceCallFromObject<StateType, ResponseType, ErrorType>(
        adaptCallToRedux<StateType, ResponseType, ErrorType>(
          api.getState,
          next,
          <ReduxActionInterface<StateType, ResponseType, ErrorType>>action,
        ),
      ),
    )
  }
}

export const loggerMiddleware: Middleware = <S>(api: MiddlewareAPI<DispatchNJ, S>) => (next: DispatchNJ) => <A extends Action>(
  action: A,
): A => {
  console.log('Before')
  const result = next(action)
  console.log(api.getState()) // Can use: api.getState()
  console.log('After') // Can use: api.getState()
  return result
}
