import { NetClientAxios } from './ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'axios'
import { AxiosNetClientConfig } from './ServiceAxiosNetClient.Types'
import ServiceClient from '../base/ServiceClient'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
import { DispatchNJ } from '../redux/Types'
import { ReduxRequest } from '../redux/ReduxRequestAction'
import { Request } from '../base/Request'
import { RequestInterceptorListType } from '../base/RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from '../base/ResponseInterceptorUtils.Types'
import { RequestInterceptorList } from '../base/RequestInterceptorUtils'
import { ResponseInterceptorList } from '../base/ResponseInterceptorUtils'

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
