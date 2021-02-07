import { NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'

export type InterceptorRequestSuccessInputFunction<
  StateType,
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> = (
  config: ConfigType,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestSuccessFunction<
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> = (config: ConfigType) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestErrorInputFunction<
  StateType,
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> = (
  error: ErrorType,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestErrorFunction<ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>, ResponseType, ErrorType> = (
  error: ErrorType,
) => Promise<ConfigType> | ConfigType | never

export type RequestInterceptorFunctionType<
  StateType,
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => RequestInterceptorType<ConfigType, ResponseType, ErrorType>

export type RequestInterceptorType<ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>, ResponseType, ErrorType> = {
  success?: InterceptorRequestSuccessFunction<ConfigType, ResponseType, ErrorType>
  error?: InterceptorRequestErrorFunction<ConfigType, ResponseType, ErrorType>
}

export type RequestInterceptorListType<
  StateType,
  ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>,
  ResponseType,
  ErrorType
> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => RequestInterceptorType<ConfigType, ResponseType, ErrorType>[]
