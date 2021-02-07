import ServiceClient from '../base/ServiceClient'
import { Action, Middleware, MiddlewareAPI } from 'redux'
import { NetClientConstructor, NetClientConfigWithID } from '../base/CommonTypes'
import { adaptCallToRedux } from './Redux.Utils'
import { ActionNJ, DispatchNJ } from './Types'
import { ReduxActionInterface, ReduxCallObjectInterfaceLiteral } from './ReduxRequestAction.Types'
import { RequestActionFromObject } from './ReduxRequestAction'
import { RequestInterceptorListType } from '../base/RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from '../base/ResponseInterceptorUtils.Types'

export function getServiceClientMiddleware<
  StateType,
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
>(
  netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  debugPrint: boolean,
  checkConnectionLost?: () => boolean,
  requestInterceptorList?: (
    getState: () => StateType,
    next: DispatchNJ,
  ) => RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
  responseInterceptorList?: (
    getState: () => StateType,
    next: DispatchNJ,
  ) => ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
): Middleware<any, any, DispatchNJ> {
  return (api: MiddlewareAPI<DispatchNJ, StateType>) => (next: DispatchNJ) => (action: ActionNJ<StateType>) => {
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
      checkConnectionLost,
      requestInterceptorList ? requestInterceptorList(api.getState, next) : undefined,
      responseInterceptorList ? responseInterceptorList(api.getState, next) : undefined,
      debugPrint,
    )
    middleware.executeRequest(
      RequestActionFromObject<StateType, ResponseType, ErrorType>(
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
