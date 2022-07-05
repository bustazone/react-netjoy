import { RequestInterface } from './Request.Types'
import { ResponseInterceptorListType, ResponseInterceptorType } from './ResponseInterceptorUtils.Types'
import { RequestInterceptorListType, RequestInterceptorType } from './RequestInterceptorUtils.Types'

export type GetNewClientOptionsType<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = {
  state?: () => StateType
  baseHeaders?: { [key: string]: string }
  requestInterceptorList?: RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>
  responseInterceptorList?: ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>
  debugPrint?: boolean
  timeoutMillis?: number
}

export type ChainLink<SuccessType, ErrorType> = (input: Either<SuccessType, ErrorType>) => Either<SuccessType, ErrorType>

type Failure<F> = { kind: 'failure'; value: F }
type Success<S> = { kind: 'success'; value: S }

type EitherValue<S, F> = Failure<F> | Success<S>

export class Either<S, F> {
  constructor(private readonly value: EitherValue<S, F>) {}

  isSuccess(): boolean {
    return this.value.kind === 'success'
  }
  isFailure(): boolean {
    return this.value.kind === 'failure'
  }

  getValue(): S | F {
    return this.value.value
  }

  getSuccess(): S | undefined {
    if (this.isSuccess()) {
      return <S>this.value.value
    }
    throw new Error('its a failure')
  }

  getFailure(): F | undefined {
    if (this.isSuccess()) {
      return <F>this.value.value
    }
    throw new Error('its a success')
  }

  getOrThrow(): S | undefined {
    if (this.isSuccess()) {
      return this.getSuccess()
    } else {
      throw this.getFailure()
    }
  }

  static success<S, F>(value: S) {
    return new Either<S, F>({ kind: 'success', value: value })
  }

  static failure<S, F>(value: F) {
    return new Either<S, F>({ kind: 'failure', value: value })
  }
}

export enum NetjoyErrorCodes {
  NETJOY_TIMEOUT_ERROR_CODE = 'NETJOY_TIMEOUT_ERROR_CODE',
  NETJOY_CANCEL_ERROR_CODE = 'NETJOY_CANCEL_ERROR_CODE',
  NETJOY_FAILURE_RESPONSE_ERROR_CODE = 'NETJOY_FAILURE_RESPONSE_ERROR_CODE',
  NETJOY_UNHANDLED_ERROR_CODE = 'NETJOY_UNHANDLED_ERROR_CODE',
}

export type NetjoyError<ClientErrorType = any, DomainErrorType = any> = {
  code: NetjoyErrorCodes
  status?: number
  domain_error?: DomainErrorType
  original?: ClientErrorType
}

export type NetjoyResponse<ClientResponseType = any, DomainResponseType = any> = {
  status: number
  domain_data?: DomainResponseType
  original?: ClientResponseType
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
    onCancel: () => void,
    debugForcedResponse?: any,
    debugForcedError?: any,
  ): () => void | undefined
}

export interface ServiceClientConstructor<
  StateType,
  // @ts-ignore
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
  StateType = any,
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ConfigType extends NetClientConfigWithID = any,
  ResponseType = any,
  ErrorType = any
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
