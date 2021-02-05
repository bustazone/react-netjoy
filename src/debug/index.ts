import ServiceClient from '../base/ServiceClient'
import { RequestInterceptorType, ResponseInterceptorType, ServiceClientInterface } from '../base/CommonTypes'
import { getServiceClientMiddleware } from '../redux/NetworkMiddleware'
import { DispatchNJ } from '../redux/Types'
import { ReduxRequest } from '../redux/ReduxRequestAction'
import { Request } from '../base/Request'
import { DebugResponse, DebugError, DebugNetClientConfig } from './ServiceDebugNetClient.Types'
import { NetClientDebug } from './ServiceDebugNetClient'

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
  requestInterceptorList: (
    serviceClient: ServiceClientInterface<State, DebugNetClientConfig, DebugResponse, DebugError>,
  ) => RequestInterceptorType<DebugNetClientConfig, DebugError>[] = () => [],
  responseInterceptorList: (
    serviceClient: ServiceClientInterface<State, DebugNetClientConfig, DebugResponse, DebugError>,
  ) => ResponseInterceptorType<DebugResponse, DebugError>[] = () => [],
  printDebug: boolean = false,
) {
  return new ServiceClient(
    NetClientDebug,
    baseUrl,
    state,
    baseHeaders,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
    printDebug,
  )
}

export function getDebugNewClientMiddleware<State>(
  baseUrl: string,
  baseHeaders: { [key: string]: string },
  checkConnectionLost?: () => boolean,
  requestInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<State, DebugNetClientConfig, DebugResponse, DebugError>,
  ) => RequestInterceptorType<DebugNetClientConfig, DebugError>[] = () => () => [],
  responseInterceptorList: (
    getState: () => State,
    next: DispatchNJ,
  ) => (
    serviceClient: ServiceClientInterface<State, DebugNetClientConfig, DebugResponse, DebugError>,
  ) => ResponseInterceptorType<DebugResponse, DebugError>[] = () => () => [],
  printDebug: boolean = false,
) {
  return getServiceClientMiddleware<State, DebugNetClientConfig, DebugResponse, DebugError>(
    NetClientDebug,
    baseUrl,
    baseHeaders,
    printDebug,
    checkConnectionLost,
    requestInterceptorList,
    responseInterceptorList,
  )
}
