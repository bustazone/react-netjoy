import { NetClientAxios } from './ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'axios'
import ServiceClient from '../base/ServiceClient'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
import { DispatchNJ } from '../redux/Types'
import { ReduxRequest } from '../redux/ReduxRequestAction'
import { Request } from '../base/Request'
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
import * as Types from './ServiceAxiosNetClient.Types'

export type AxiosNetClientConfig = Types.AxiosNetClientConfig

export type AxiosInterceptorRequestSuccessInputFunctionType<StateType> = InterceptorRequestSuccessInputFunction<
  StateType,
  AxiosNetClientConfig,
  AxiosResponse,
  AxiosError
>

export type AxiosInterceptorRequestErrorInputFunctionType<StateType> = InterceptorRequestErrorInputFunction<
  StateType,
  AxiosNetClientConfig,
  AxiosResponse,
  AxiosError
>

export type AxiosInterceptorResponseSuccessInputFunctionType<StateType> = InterceptorResponseSuccessInputFunction<
  StateType,
  AxiosNetClientConfig,
  AxiosResponse,
  AxiosError
>

export type AxiosInterceptorResponseErrorInputFunctionType<StateType> = InterceptorResponseErrorInputFunction<
  StateType,
  AxiosNetClientConfig,
  AxiosResponse,
  AxiosError
>

export class AxiosRequestInterceptorList<State> extends RequestInterceptorList<State, AxiosNetClientConfig, AxiosResponse, AxiosError> {}

export class AxiosResponseInterceptorList<State> extends ResponseInterceptorList<State, AxiosNetClientConfig, AxiosResponse, AxiosError> {}

export function getAxiosEmptyRequest<State>() {
  return new Request<State, AxiosResponse, AxiosError>()
}

export function getAxiosEmptyRequestAction<State>(req?: Request<State, AxiosResponse, AxiosError>) {
  return new ReduxRequest<State, AxiosResponse, AxiosError>(req)
}

export function getAxiosNewClient<State>(
  baseUrl: string,
  state: () => State,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: RequestInterceptorListType<State, AxiosNetClientConfig, AxiosResponse, AxiosError> = () => [],
  responseInterceptorList: ResponseInterceptorListType<State, AxiosNetClientConfig, AxiosResponse, AxiosError> = () => [],
  debugPrint: boolean = false,
) {
  return new ServiceClient<State, AxiosNetClientConfig, AxiosResponse, AxiosError>(
    NetClientAxios,
    baseUrl,
    state,
    baseHeaders,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
    debugPrint,
  )
}

export function getAxiosNewClientMiddleware<State>(
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => RequestInterceptorListType<State, AxiosNetClientConfig, AxiosResponse, AxiosError> = () => () => [],
  responseInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => ResponseInterceptorListType<State, AxiosNetClientConfig, AxiosResponse, AxiosError> = () => () => [],
  debugPrint: boolean = false,
) {
  return getServiceClientMiddleware<State, AxiosNetClientConfig, AxiosResponse, AxiosError>(
    NetClientAxios,
    baseUrl,
    baseHeaders,
    debugPrint,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
  )
}
