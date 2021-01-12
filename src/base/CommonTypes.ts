import { CallInterface } from './ServiceCallAction'

export interface NetClientConfigWithID {
  reqId: string
}

export interface NetClientConstructor<C extends NetClientConfigWithID, R, E> {
  new (
    baseUrl: string,
    requestInterceptorList: RequestInterceptorType<C, E>[],
    responseInterceptorList: ResponseInterceptorType<R, E>[],
    baseHeaders: { [key: string]: string },
    timeout?: number,
    printDebug?: boolean,
  ): NetClientInterface<R>
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
  ): () => void | undefined
}

export type SuccessRequestMethodType<C extends NetClientConfigWithID> = (config: C) => Promise<C> | C | never
export type SuccessResponseMethodType<R> = (response: R) => Promise<R> | R | never
export type FailureRequestMethodType<E, C> = (error: E) => Promise<C> | C | never
export type FailureResponseMethodType<E, R> = (error: E) => Promise<R> | R | never
export type RequestInterceptorType<C extends NetClientConfigWithID, E> = {
  success?: SuccessRequestMethodType<C>
  error?: FailureRequestMethodType<E, C>
}
export type ResponseInterceptorType<R, E> = {
  success?: SuccessResponseMethodType<R>
  error?: FailureResponseMethodType<E, R>
}

export interface ServiceClientInterface<
  StateType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
> {
  getState: () => StateType
  checkConnectionLost?: () => boolean
  printDebug: boolean
  netClient: NetClientInterface<ResponseType>
  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<ResponseType>
  executeAction(call: CallInterface<StateType, ResponseType, ErrorType>): () => void | undefined
}
