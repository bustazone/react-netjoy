import { InterceptorResponseErrorInputFunction } from '../../base/ResponseInterceptorUtils.Types'
import { NetClientConfigWithID } from '../../base'

function getResponseFailureInterceptor<
  StateType,
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
>(): InterceptorResponseErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType> {
  return (error, _serviceClient) => {
    console.log('ResponseFailureInterceptor')
    console.log(JSON.stringify(error))
    throw error
  }
}

export default getResponseFailureInterceptor
