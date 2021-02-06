import { RequestInterface } from './Request.Types'
import { ResponseInterceptorType } from './ResponseInterceptorUtils.Types'
import { RequestInterceptorType } from './RequestInterceptorUtils.Types'

export interface NetClientConfigWithID {
  reqId: string
  debugForcedResponse?: any
  debugForcedError?: any
}

export interface NetClientConstructor<ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  new (
    baseUrl: string,
    requestInterceptorList: RequestInterceptorType<ConfigType, ErrorType>[],
    responseInterceptorList: ResponseInterceptorType<ResponseType, ErrorType>[],
    baseHeaders: { [key: string]: string },
    timeout?: number,
    debugPrint?: boolean,
  ): NetClientInterface<ResponseType>
}

export interface NetClientInterface<R> {
  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<R>
  makeCallFromParams(
    reqId: string,
    url: string,
    method: string,
    body: string,
    headers: object,
    onStart: () => void,
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void,
    onFinish: () => void,
    debugForcedResponse?: any,
    debugForcedError?: any,
  ): () => void | undefined
}

// @ts-ignore
export interface ServiceClientInterface<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  getState: () => StateType
  checkConnectionLost?: () => boolean
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType>
  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<ResponseType>
  executeRequest(req: RequestInterface<StateType, ResponseType, ErrorType>): () => void | undefined
}
