import { NetClientConfigWithID } from '../../base'
import { InterceptorResponseSuccessInputFunction } from '../../base/ResponseInterceptorUtils.Types';

function getResponseSuccessInterceptor<
  StateType,
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
>(): InterceptorResponseSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType> {
  return (response, _serviceClient) => {
    console.log('ResponseSuccessInterceptor')
    console.log(JSON.stringify(response))
    return response
  }
}

export default getResponseSuccessInterceptor
