import { CallInterface } from './ServiceCallAction'
import {
  NetClientConstructor,
  NetClientInterface,
  ServiceClientInterface,
  NetClientConfigWithID,
  RequestInterceptorType,
  ResponseInterceptorType,
} from './CommonTypes'

class ServiceClient<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
  implements ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> {
  getState: () => StateType
  checkConnectionLost?: () => boolean
  printDebug: boolean
  netClient: NetClientInterface<ResponseType>

  constructor(
    netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
    baseUrl: string,
    getState: () => StateType,
    baseHeaders: { [key: string]: string },
    checkConnectionLost?: () => boolean,
    requestInterceptorList: (
      serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
    ) => RequestInterceptorType<ConfigType, ErrorType>[] = () => [],
    responseInterceptorList: (
      serviceClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>,
    ) => ResponseInterceptorType<ResponseType, ErrorType>[] = () => [],
    printDebug: boolean = false,
  ) {
    this.getState = getState
    this.printDebug = printDebug
    this.checkConnectionLost = checkConnectionLost
    this.netClient = new netClientCtor(
      baseUrl,
      requestInterceptorList(this),
      responseInterceptorList(this),
      baseHeaders,
      undefined,
      printDebug,
    )
  }

  onInnerSuccess = (call: CallInterface<StateType, ResponseType, ErrorType>) => (response: ResponseType) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response before transformation: ', response)
    }
    let transformedResponse = response
    if (call.transformResponseDataWithState) {
      transformedResponse = call.transformResponseDataWithState(response, this.getState())
    }
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponse)
    }
    if (call.onSuccess) {
      call.onSuccess(transformedResponse)
    }
  }

  onInnerFailure = (call: CallInterface<StateType, ResponseType, ErrorType>) => (error: ErrorType) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final error before transformation: ', error)
    }
    let transformedError = error
    if (call.transformErrorDataWithState) {
      transformedError = call.transformErrorDataWithState(error, this.getState())
    }
    if (this.printDebug) {
      console.log('[NetJoyBase] Final error after transformation: ', transformedError)
    }
    if (call.onFailure) {
      call.onFailure(transformedError)
    }
  }

  onInnerFinish = (call: CallInterface<StateType, ResponseType, ErrorType>) => () => {
    if (call.onFinish) {
      call.onFinish()
    }
  }

  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<ResponseType> {
    // if (this.checkConnectionLost !== undefined) {
    //   if (!this.checkConnectionLost(this.next)) {
    //     this.onFailure({
    //       innerMessage: `Failure Before started ${config.reqId} due to lack of connection`,
    //     })
    //     return
    //   }
    // }

    return this.netClient.executeDirectCallWithConfig<T>(config)
  }

  executeAction(call: CallInterface<StateType, ResponseType, ErrorType>) {
    // const call = CallInterface<S>(action)

    let body = ''
    if (call.setBodyFromState) {
      body = call.setBodyFromState(this.getState())
    }

    if (this.printDebug) {
      console.log(`[NetJoyBase] Started call ${call.reqId} : ${call}`)
    }

    // if (this.checkConnectionLost && !this.checkConnectionLost()) {
    //   call.onFailure({
    //     innerMessage: `Failure Before started ${call.reqId} due to lack of connection`,
    //   })
    //   return
    // }

    return this.netClient.makeCallFromParams(
      call.reqId,
      call.setEndpointFromState!(this.getState()),
      call.method,
      body,
      call.getHeadersFromState(this.getState()),
      call.onStart,
      this.onInnerSuccess(call),
      this.onInnerFailure(call),
      this.onInnerFinish(call),
    )
  }

  // cancelAllRequests() {
  //   // cancel all request in the array
  //   this.requestList.forEach(requestData => {
  //     if (requestData.cancel) requestData.cancel()
  //   })
  // }
  //
  // cancelRequestsByReqId(reqId: string) {
  //   // cancel all request in the array
  //   const requestData = this.requestList.find(item => {
  //     return item.call.reqId === reqId
  //   })
  //   if (requestData) {
  //     if (requestData.cancel) requestData.cancel()
  //     return
  //   }
  // }
}

export default ServiceClient
