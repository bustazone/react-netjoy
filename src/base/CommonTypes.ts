import { RequestInterface } from './Request.Types'
import { ResponseInterceptorListType, ResponseInterceptorType } from './ResponseInterceptorUtils.Types'
import { RequestInterceptorListType, RequestInterceptorType } from './RequestInterceptorUtils.Types'

export type NetjoyError<ClientErrorType = any, DomainErrorType = any> = {
  code: number
  error?: DomainErrorType
  _original: ClientErrorType
}

export type NetjoyResponse<ClientResponseType = any, DomainResponseType = any> = {
  status: number
  data: DomainResponseType
  config: NetClientConfigWithID
  _original?: ClientResponseType
}

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
    baseHeaders?: { [key: string]: string },
    timeout?: number,
    debugPrint?: boolean,
  ): NetClientInterface<ResponseType, ErrorType>
}

export interface NetClientInterface<ResponseType, ErrorType> {
  executeDirectCallWithConfig<ConfigType extends NetClientConfigWithID>(config: ConfigType): Promise<ResponseType>
  makeCallFromParams(
    reqId: string,
    url: string,
    method: string,
    body: string,
    headers: object,
    onStart: () => void,
    onSuccess: (response: NetjoyResponse<ResponseType>) => void,
    onFailure: (error: NetjoyError<ErrorType>) => void,
    onFinish: () => void,
    debugForcedResponse?: any,
    debugForcedError?: any,
  ): () => void | undefined
}

export interface ServiceClientConstructor<
  StateType,
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
> {
  new (
    netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
    baseUrl: string,
    getState: () => StateType,
    baseHeaders: { [key: string]: string },
    requestInterceptorList: RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
    responseInterceptorList: ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>,
    debugPrint: boolean,
    timeoutMillis?: number,
  ): NetClientInterface<ResponseType, ErrorType>
}

export interface ServiceClientInterface<
  StateType,
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
> {
  getState?: () => StateType
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType, ErrorType>
  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<ResponseType>
  executeRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
  ): (() => void) | undefined
  executeLastestRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
    sequenceId?: string,
  ): (() => void) | undefined
}
