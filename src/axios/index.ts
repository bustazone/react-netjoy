import { NetClientAxios } from './ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'axios'
import ServiceClient from '../base/ServiceClient'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
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
import { Dispatch } from 'redux'

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

export type GetAxiosNewClientOptionsType<StateType = any> = {
  state?: () => StateType
  baseHeaders?: { [key: string]: string }
  requestInterceptorList?: RequestInterceptorListType<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>
  responseInterceptorList?: ResponseInterceptorListType<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>
  debugPrint?: boolean
  timeoutMillis?: number
}

export function getAxiosNewClient<StateType = any>(baseUrl: string, options?: GetAxiosNewClientOptionsType<StateType>) {
  return new ServiceClient<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>(
    NetClientAxios,
    baseUrl,
    options?.state,
    options?.baseHeaders,
    options?.requestInterceptorList,
    options?.responseInterceptorList,
    options?.debugPrint,
    options?.timeoutMillis,
  )
}

export type GetAxiosNewClientMiddlewareOptionsType<StateType> = {
  baseHeaders?: { [key: string]: string }
  requestInterceptorList: (
    getState: () => StateType,
    next: Dispatch,
  ) => RequestInterceptorListType<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>
  responseInterceptorList: (
    getState: () => StateType,
    next: Dispatch,
  ) => ResponseInterceptorListType<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>
  debugPrint?: boolean
  timeoutMillis?: number
}

export function getAxiosNewClientMiddleware<StateType>(baseUrl: string, options?: GetAxiosNewClientMiddlewareOptionsType<StateType>) {
  return getServiceClientMiddleware<StateType, AxiosNetClientConfig, AxiosResponse, AxiosError>(
    NetClientAxios,
    baseUrl,
    options?.baseHeaders,
    options?.debugPrint,
    options?.timeoutMillis,
    options?.requestInterceptorList,
    options?.responseInterceptorList,
  )
}
