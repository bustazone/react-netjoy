import { NetClientAxios } from './ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'axios'
import { AxiosNetClientConfig } from './ServiceAxiosNetClient.Types'
import ServiceClient from '../base/ServiceClient'
import { RequestInterceptorType, ResponseInterceptorType, ServiceClientInterface } from '../base/CommonTypes'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
import { DispatchNJ } from '../redux/Types'
import { ReduxRequest } from '../redux/ReduxRequestAction'
import { Request } from '../base/Request'

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
  requestInterceptorList: (
    serviceClient: ServiceClientInterface<State, AxiosNetClientConfig, AxiosResponse, AxiosError>,
  ) => RequestInterceptorType<AxiosNetClientConfig, AxiosError>[] = () => [],
  responseInterceptorList: (
    serviceClient: ServiceClientInterface<State, AxiosNetClientConfig, AxiosResponse, AxiosError>,
  ) => ResponseInterceptorType<AxiosResponse, AxiosError>[] = () => [],
  printDebug: boolean = false,
) {
  return new ServiceClient(
    NetClientAxios,
    baseUrl,
    state,
    baseHeaders,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
    printDebug,
  )
}

export function getAxiosNewClientMiddleware<State>(
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<State, AxiosNetClientConfig, AxiosResponse, AxiosError>,
  ) => RequestInterceptorType<AxiosNetClientConfig, AxiosError>[] = () => () => [],
  responseInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<State, AxiosNetClientConfig, AxiosResponse, AxiosError>,
  ) => ResponseInterceptorType<AxiosResponse, AxiosError>[] = () => () => [],
  printDebug: boolean = false,
) {
  return getServiceClientMiddleware<State, AxiosNetClientConfig, AxiosResponse, AxiosError>(
    NetClientAxios,
    baseUrl,
    baseHeaders,
    printDebug,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
  )
}
