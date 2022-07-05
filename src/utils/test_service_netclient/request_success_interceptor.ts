import { NetClientConfigWithID } from '../../base'
import { InterceptorRequestSuccessInputFunction } from '../../base/RequestInterceptorUtils.Types'

function getRequestSuccessInterceptor<
  StateType,
  ConfigType extends NetClientConfigWithID,
  ResponseType,
  ErrorType
>(): InterceptorRequestSuccessInputFunction<StateType, ConfigType, ResponseType, ErrorType> {
  return (config, _serviceClient) => {
    console.log('RequestSuccessInterceptor')
    console.log(JSON.stringify(config))
    return config
  }
}

export default getRequestSuccessInterceptor
