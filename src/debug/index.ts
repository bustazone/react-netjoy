import { ServiceClient } from '../base'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
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
import { Dispatch } from 'redux'

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

export function getDebugNewClient<State>(
  baseUrl: string,
  state: () => State,
  baseHeaders: { [key: string]: string },
  requestInterceptorList: RequestInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => [],
  responseInterceptorList: ResponseInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => [],
  debugPrint: boolean = false,
  timeoutMillis: number = 10000,
) {
  return new ServiceClient(
    NetClientDebug,
    baseUrl,
    state,
    baseHeaders,
    requestInterceptorList,
    responseInterceptorList,
    debugPrint,
    timeoutMillis,
  )
}

export function getDebugNewClientMiddleware<State>(
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  requestInterceptorList: (
    getState: () => State,
    next: Dispatch,
  ) => RequestInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => () => [],
  responseInterceptorList: (
    getState: () => State,
    next: Dispatch,
  ) => ResponseInterceptorListType<State, DebugNetClientConfig, DebugResponse, DebugError> = () => () => [],
  debugPrint: boolean = false,
  timeoutMillis: number = 10000,
) {
  return getServiceClientMiddleware<State, DebugNetClientConfig, DebugResponse, DebugError>(
    NetClientDebug,
    baseUrl,
    baseHeaders,
    debugPrint,
    timeoutMillis,
    requestInterceptorList,
    responseInterceptorList,
  )
}
