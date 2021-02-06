import { NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'

export type InterceptorResponseSuccessInputFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  response: ResponseType,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => Promise<ResponseType> | ResponseType | never

export type InterceptorResponseSuccessFunction<ResponseType> = (response: ResponseType) => Promise<ResponseType> | ResponseType | never

export type InterceptorResponseErrorInputFunction<RootState, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  error: ErrorType,
  serviceClient: ServiceClientInterface<RootState, ConfigType, ResponseType, ErrorType>,
) => Promise<ResponseType> | ResponseType | never

export type InterceptorResponseErrorFunction<ResponseType, ErrorType> = (error: ErrorType) => Promise<ResponseType> | ResponseType | never

export type ResponseInterceptorFunctionType<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
) => ResponseInterceptorType<ResponseType, ErrorType>

export type ResponseInterceptorType<ResponseType, ErrorType> = {
  success?: InterceptorResponseSuccessFunction<ResponseType>
  error?: InterceptorResponseErrorFunction<ResponseType, ErrorType>
}

export type ResponseInterceptorListType<RootState, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<RootState, ConfigType, ResponseType, ErrorType>,
) => ResponseInterceptorType<ResponseType, ErrorType>[]
