import { RequestInterface } from './Request.Types'
import { NetClientConstructor, NetClientInterface, ServiceClientInterface, NetClientConfigWithID } from './CommonTypes'
import { RequestInterceptorListType } from './RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from './ResponseInterceptorUtils.Types'

class ServiceClient<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
  implements ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> {
  getState: () => StateType
  checkConnectionLost?: () => boolean
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType>

  constructor(
    netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
    baseUrl: string,
    getState: () => StateType,
    baseHeaders: { [key: string]: string },
    checkConnectionLost?: () => boolean,
    requestInterceptorList: RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> = () => [],
    responseInterceptorList: ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> = () => [],
    debugPrint: boolean = false,
  ) {
    this.getState = getState
    this.debugPrint = debugPrint
    this.checkConnectionLost = checkConnectionLost
    this.netClient = new netClientCtor(
      baseUrl,
      requestInterceptorList(this),
      responseInterceptorList(this),
      baseHeaders,
      undefined,
      debugPrint,
    )
  }

  onInnerSuccess = (req: RequestInterface<StateType, ResponseType, ErrorType>) => (response: ResponseType) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response before transformation: ', response)
    }
    let transformedResponse = response
    if (req.transformResponseDataWithState) {
      transformedResponse = req.transformResponseDataWithState(response, this.getState())
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponse)
    }
    if (req.onSuccess) {
      req.onSuccess(transformedResponse)
    }
  }

  onInnerFailure = (req: RequestInterface<StateType, ResponseType, ErrorType>) => (error: ErrorType) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error before transformation: ', error)
    }
    let transformedError = error
    if (req.transformErrorDataWithState) {
      transformedError = req.transformErrorDataWithState(error, this.getState())
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error after transformation: ', transformedError)
    }
    if (req.onFailure) {
      req.onFailure(transformedError)
    }
  }

  onInnerFinish = (req: RequestInterface<StateType, ResponseType, ErrorType>) => () => {
    if (req.onFinish) {
      req.onFinish()
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

  executeRequest(req: RequestInterface<StateType, ResponseType, ErrorType>) {
    let body = ''
    if (req.setBodyFromState) {
      body = req.setBodyFromState(this.getState())
    }

    if (this.debugPrint) {
      console.log(`[NetJoyBase] Started req ${req.reqId} : ${JSON.stringify(req)}`)
    }

    if (this.checkConnectionLost && !this.checkConnectionLost()) {
      req.onFailure({
        innerMessage: `Failure Before started ${req.reqId} due to lack of connection`,
      })
      return () => {}
    }

    return this.netClient.makeCallFromParams(
      req.reqId,
      req.setEndpointFromState!(this.getState()),
      req.method,
      body,
      req.getHeadersFromState(this.getState()),
      req.onStart,
      this.onInnerSuccess(req),
      this.onInnerFailure(req),
      this.onInnerFinish(req),
      req.debugForcedResponse,
      req.debugForcedError,
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
  //     return item.req.reqId === reqId
  //   })
  //   if (requestData) {
  //     if (requestData.cancel) requestData.cancel()
  //     return
  //   }
  // }
}

export default ServiceClient
