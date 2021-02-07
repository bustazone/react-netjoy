import { RequestInterface } from './Request.Types'
import { ResponseInterceptorType } from './ResponseInterceptorUtils.Types'
import { RequestInterceptorType } from './RequestInterceptorUtils.Types'

export interface NetClientConfigWithID<ResponseType, ErrorType> {
  reqId: string
  debugForcedResponse?: ResponseType
  debugForcedError?: ErrorType
}

export interface NetClientConstructor<ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>, ResponseType, ErrorType> {
  new (
    baseUrl: string,
    requestInterceptorList: RequestInterceptorType<ConfigType, ResponseType, ErrorType>[],
    responseInterceptorList: ResponseInterceptorType<ResponseType, ErrorType>[],
    baseHeaders: { [key: string]: string },
    timeout?: number,
    debugPrint?: boolean,
  ): NetClientInterface<ResponseType, ErrorType>
}

export interface NetClientInterface<ResponseType, ErrorType> {
  executeDirectCallWithConfig<ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>>(config: ConfigType): Promise<ResponseType>
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
    debugForcedResponse?: ResponseType,
    debugForcedError?: ErrorType,
  ): () => void | undefined
}

export interface ServiceClientInterface<
  StateType,
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> {
  getState: () => StateType
  checkConnectionLost?: () => boolean
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType, ErrorType>
  executeDirectCallWithConfig<T extends NetClientConfigWithID<ResponseType, ErrorType>>(config: T): Promise<ResponseType>
  executeRequest(req: RequestInterface<StateType, ResponseType, ErrorType>): () => void | undefined
}
