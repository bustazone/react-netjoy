import { ChainLink, Either, NetClientConfigWithID, ServiceClientInterface } from './CommonTypes'

export type ResponseChainLinkMethod<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = (
  serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  input: Either<ResponseType, ErrorType>,
) => Either<ResponseType, ErrorType>

export type ResponseChainLink<ResponseType, ErrorType> = (
  input: Either<ResponseType, ErrorType>,
) => Either<ResponseType, ErrorType>

export class ResponseInterceptorListV2<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  private list: ResponseChainLinkMethod<StateType, ConfigType, ResponseType, ErrorType>[] = []

  private createRequestInterceptorList(): (
    serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  ) => ChainLink<ResponseType, ErrorType>[] {
    return (serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>) => {
      return this.list.map(item => {
        return (input: Either<ResponseType, ErrorType>) => item(serviceClient, input)
      })
    }
  }

  addInterceptor(
    method: ResponseChainLinkMethod<StateType, ConfigType, ResponseType, ErrorType>,
  ): ResponseInterceptorListV2<StateType, ConfigType, ResponseType, ErrorType> {
    this.list.push(method)
    return this
  }

  getList(): (
    serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
  ) => ChainLink<ResponseType, ErrorType>[] {
    return this.createRequestInterceptorList()
  }
}
