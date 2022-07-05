import getResponseSuccessInterceptor from './response_success_interceptor'
import getRequestFailureInterceptor from './request_failure_interceptor'
import getResponseFailureInterceptor from './response_failure_interceptor'
import getRequestSuccessInterceptor from './request_success_interceptor'
import { RequestInterceptorListConstructableInterface } from '../../base/RequestInterceptorUtils'
import { GetNewClientOptionsType, NetClientConfigWithID, NetjoyError, NetjoyResponse, ServiceClient } from '../../base'
import { ResponseInterceptorListConstructableInterface } from '../../base/ResponseInterceptorUtils'
import { delayReq } from './request'

export class TestServiceNetClient<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> {
  netClient
  constructor(
    getNewClient: (
      baseUrl: string,
      options?: GetNewClientOptionsType<StateType, ConfigType, ResponseType, ErrorType>,
    ) => ServiceClient<StateType, ConfigType, ResponseType, ErrorType>,
    axiosResponseInterceptorList: ResponseInterceptorListConstructableInterface<ConfigType, ResponseType, ErrorType>,
    axiosRequestInterceptorList: RequestInterceptorListConstructableInterface<ConfigType, ResponseType, ErrorType>,
  ) {
    const responseInterceptor = new axiosResponseInterceptorList<{}>()
    const requestInterceptor = new axiosRequestInterceptorList<{}>()
    responseInterceptor.addInterceptor(getResponseSuccessInterceptor(), getResponseFailureInterceptor())
    requestInterceptor.addInterceptor(getRequestSuccessInterceptor(), getRequestFailureInterceptor())
    this.netClient = getNewClient('http://localhost:666/', {
      baseHeaders: { 'Access-Control-Allow-Origin': '*' },
      requestInterceptorList: requestInterceptor.getList(),
      responseInterceptorList: responseInterceptor.getList(),
      debugPrint: true,
    })
  }

  execute(): boolean {
    this.testCancel()
    return true
  }

  private testCancel() {
    const onSuccess = (res: NetjoyResponse<ResponseType>) => {
      console.log(res)
    }
    const onFailure = (error: NetjoyError<ErrorType>) => {
      console.log(error)
    }
    this.netClient.executeLastestRequest(delayReq(onSuccess, onFailure))
    setTimeout(() => {
      this.netClient.executeLastestRequest(delayReq(onSuccess, onFailure))
    }, 2000)
  }
}
