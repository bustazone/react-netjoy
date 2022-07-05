import { ChainLink, Either, NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'

export type RequestChainLinkMethod<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  input: Either<ConfigType, ErrorType>,
) => Either<ConfigType, ErrorType>

export type RequestChainLink<ConfigType extends NetClientConfigWithID, ErrorType> = (
  input: Either<ConfigType, ErrorType>,
) => Either<ConfigType, ErrorType>

export class RequestInterceptorListV2<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  private list: RequestChainLinkMethod<StateType, ConfigType, ResponseType, ErrorType>[] = []

  private createRequestInterceptorList(): (
    serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  ) => ChainLink<ConfigType, ErrorType>[] {
    return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => {
      return this.list.map(item => {
        return (input: Either<ConfigType, ErrorType>) => item(serviceClient, input)
      })
    }
  }

  addInterceptor(
    method: RequestChainLinkMethod<StateType, ConfigType, ResponseType, ErrorType>,
  ): RequestInterceptorListV2<StateType, ConfigType, ResponseType, ErrorType> {
    this.list.push(method)
    return this
  }

  getList(): (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => ChainLink<ConfigType, ErrorType>[] {
    return this.createRequestInterceptorList()
  }
}
