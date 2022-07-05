import { NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'
import {
  InterceptorRequestErrorFunction,
  InterceptorRequestErrorInputFunction,
  InterceptorRequestSuccessFunction,
  InterceptorRequestSuccessInputFunction,
  RequestInterceptorFunctionType,
  RequestInterceptorListType,
} from './RequestInterceptorUtils.Types'

function createRequestInterceptorSuccessFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  method: InterceptorRequestSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType> | undefined,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
): InterceptorRequestSuccessFunction<ConfigType> {
  return (config: ConfigType) => {
    if (method) {
      return method(config, serviceClient)
    } else {
      return config
    }
  }
}

function createRequestInterceptorErrorFunction<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  method: InterceptorRequestErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType> | undefined,
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
): InterceptorRequestErrorFunction<ConfigType, ErrorType> {
  return (error: ErrorType) => {
    if (method) {
      return method(error, serviceClient)
    } else {
      throw error
    }
  }
}

function createRequestInterceptor<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>(
  onSuccess?: InterceptorRequestSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  onFailure?: InterceptorRequestErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
): RequestInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType> {
  return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => ({
    success: createRequestInterceptorSuccessFunction(onSuccess, serviceClient),
    error: createRequestInterceptorErrorFunction(onFailure, serviceClient),
  })
}

export interface RequestInterceptorListInterface<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  addInterceptor: (
    onSuccess?: InterceptorRequestSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
    onFailure?: InterceptorRequestErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  ) => RequestInterceptorList<StateType, ConfigType, ResponseType, ErrorType>
  getList: () => RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType>
}

export interface RequestInterceptorListConstructableInterface<ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  new <StateType>(): RequestInterceptorListInterface<StateType, ConfigType, ResponseType, ErrorType>
}

export class RequestInterceptorList<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
  implements RequestInterceptorListInterface<StateType, ConfigType, ResponseType, ErrorType> {
  private list: RequestInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType>[] = []

  private createRequestInterceptorList(
    interceptors: RequestInterceptorFunctionType<StateType, ConfigType, ResponseType, ErrorType>[],
  ): RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> {
    return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => {
      return interceptors.map(item => {
        return item(serviceClient)
      })
    }
  }

  addInterceptor(
    onSuccess?: InterceptorRequestSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
    onFailure?: InterceptorRequestErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType>,
  ): RequestInterceptorList<StateType, ConfigType, ResponseType, ErrorType> {
    this.list.push(createRequestInterceptor(onSuccess, onFailure))
    return this
  }

  getList(): RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> {
    return this.createRequestInterceptorList(this.list)
  }
}
