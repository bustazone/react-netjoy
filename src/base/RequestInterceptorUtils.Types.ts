import { NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'

export type InterceptorRequestSuccessInputFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  config: ConfigType,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestSuccessFunction<ConfigType extends NetClientConfigWithID> = (
  config: ConfigType,
) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestErrorInputFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  error: ErrorType,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => Promise<ConfigType> | ConfigType | never

export type InterceptorRequestErrorFunction<ConfigType extends NetClientConfigWithID, ErrorType> = (
  error: ErrorType,
) => Promise<ConfigType> | ConfigType | never

export type RequestInterceptorFunctionType<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => RequestInterceptorType<ConfigType, ErrorType>

export type RequestInterceptorType<ConfigType extends NetClientConfigWithID, ErrorType> = {
  success?: InterceptorRequestSuccessFunction<ConfigType>
  error?: InterceptorRequestErrorFunction<ConfigType, ErrorType>
}

export type RequestInterceptorListType<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => RequestInterceptorType<ConfigType, ErrorType>[]
