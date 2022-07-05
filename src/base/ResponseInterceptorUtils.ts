import { NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'
import {
  InterceptorResponseErrorFunction,
  InterceptorResponseErrorInputFunction,
  InterceptorResponseSuccessFunction,
  InterceptorResponseSuccessInputFunction,
  ResponseInterceptorFunctionType,
  ResponseInterceptorListType,
} from './ResponseInterceptorUtils.Types'

function createResponseInterceptorSuccessFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  method: InterceptorResponseSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType> | undefined,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
): InterceptorResponseSuccessFunction<ResponseType> {
  return (response: ResponseType) => {
    if (method) {
      return method(response, serviceClient)
    } else {
      return response
    }
  }
}

function createResponseInterceptorErrorFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  method: InterceptorResponseErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType> | undefined,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
): InterceptorResponseErrorFunction<ResponseType, ErrorType> {
  return (error: ErrorType) => {
    if (method) {
      return method(error, serviceClient)
    } else {
      throw error
    }
  }
}

function createResponseInterceptor<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  onSuccess?: InterceptorResponseSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  onFailure?: InterceptorResponseErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
): ResponseInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType> {
  return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => ({
    success: createResponseInterceptorSuccessFunction(onSuccess, serviceClient),
    error: createResponseInterceptorErrorFunction(onFailure, serviceClient),
  })
}

export interface ResponseInterceptorListInterface<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  addInterceptor: (
    onSuccess?: InterceptorResponseSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
    onFailure?: InterceptorResponseErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  ) => ResponseInterceptorList<StateType, ConfigType, ResponseType, ErrorType>
  getList: () => ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>
}

export interface ResponseInterceptorListConstructableInterface<ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  new <StateType>(): ResponseInterceptorListInterface<StateType, ConfigType, ResponseType, ErrorType>
}

export class ResponseInterceptorList<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
  implements ResponseInterceptorListInterface<StateType, ConfigType, ResponseType, ErrorType> {
  private list: ResponseInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType>[] = []

  private createResponseInterceptorList(
    interceptors: ResponseInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType>[],
  ): ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> {
    return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => {
      return interceptors.map(item => {
        return item(serviceClient)
      })
    }
  }

  addInterceptor(
    onSuccess?: InterceptorResponseSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
    onFailure?: InterceptorResponseErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  ): ResponseInterceptorList<StateType, ConfigType, ResponseType, ErrorType> {
    this.list.push(createResponseInterceptor(onSuccess, onFailure))
    return this
  }

  getList() {
    return this.createResponseInterceptorList(this.list)
  }
}
