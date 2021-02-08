import ServiceClient from '../base/ServiceClient'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
import { DispatchNJ } from '../redux/Types'
import { ReduxRequest } from '../redux/ReduxRequestAction'
import { Request } from '../base/Request'
import { DebugResponse, DebugError } from './ServiceDebugNetClient.Types'
import { NetClientDebug } from './ServiceDebugNetClient'
import {
  InterceptorRequestErrorInputFunction,
  InterceptorRequestSuccessInputFunction,
  RequestInterceptorListType,
} from '../base/RequestInterceptorUtils.Types'
import {
  InterceptorResponseErrorInputFunction,
  InterceptorResponseSuccessInputFunction,
  ResponseInterceptorListType,
} from '../base/ResponseInterceptorUtils.Types'
import { RequestInterceptorList } from '../base/RequestInterceptorUtils'
import { ResponseInterceptorList } from '../base/ResponseInterceptorUtils'
import * as Types from './ServiceDebugNetClient.Types'

export type DebugNetClientConfig = Types.DebugNetClientConfig

export type DebugInterceptorRequestSuccessInputFunctionType<StateType> = InterceptorRequestSuccessInputFunction<
  StateType,
  DebugNetClientConfig,
  DebugResponse,
  DebugError
>

export type DebugInterceptorRequestErrorInputFunctionType<StateType> = InterceptorRequestErrorInputFunction<
  StateType,
  DebugNetClientConfig,
  DebugResponse,
  DebugError
>

export type DebugInterceptorResponseSuccessInputFunctionType<StateType> = InterceptorResponseSuccessInputFunction<
  StateType,
  DebugNetClientConfig,
  DebugResponse,
  DebugError
>

export type DebugInterceptorResponseErrorInputFunctionType<StateType> = InterceptorResponseErrorInputFunction<
  StateType,
  DebugNetClientConfig,
  DebugResponse,
  DebugError
>

export class DebugRequestInterceptorList<State> extends RequestInterceptorList<State, DebugNetClientConfig, DebugResponse, DebugError> {}

export class DebugResponseInterceptorList<State> extends ResponseInterceptorList<State, DebugNetClientConfig, DebugResponse, DebugError> {}

export function getDebugEmptyRequest<State>() {
  return new Request<State, DebugResponse, DebugError>()
}

export function getDebugEmptyRequestAction<State>(req?: Request<State, DebugResponse, DebugError>) {
  return new ReduxRequest<State, DebugResponse, DebugError>(req)
}

export function getDebugNewClient<State>(
  baseUrl: string,
  state: () => State,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: RequestInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => [],
  responseInterceptorList: ResponseInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => [],
  debugPrint: boolean = false,
) {
  return new ServiceClient(
    NetClientDebug,
    baseUrl,
    state,
    baseHeaders,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
    debugPrint,
  )
}

export function getDebugNewClientMiddleware<State>(
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => RequestInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => () => [],
  responseInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => ResponseInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => () => [],
  debugPrint: boolean = false,
) {
  return getServiceClientMiddleware<State, DebugNetClientConfig, DebugResponse, DebugError>(
    NetClientDebug,
    baseUrl,
    baseHeaders,
    debugPrint,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
  )
}