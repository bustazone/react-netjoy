import { InterceptorRequestErrorInputFunction } from '../../base/RequestInterceptorUtils.Types'
import { NetClientConfigWithID } from '../../base'

function getRequestFailureInterceptor<
  StateType,
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
>(): InterceptorRequestErrorInputFunction<StateType, ConfigType, ResponseType, ErrorType> {
  return (error, _serviceClient) => {
    console.log('RequestFailureInterceptor')
    console.log(JSON.stringify(error))
    throw error
  }
}

export default getRequestFailureInterceptor
