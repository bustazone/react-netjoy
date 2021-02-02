import { RequestInterface } from './Request.Types'
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

  onInnerSuccess = (req: RequestInterface<StateType, ResponseType, ErrorType>) => (response: ResponseType) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response before transformation: ', response)
    }
    let transformedResponse = response
    if (req.transformResponseDataWithState) {
      transformedResponse = req.transformResponseDataWithState(response, this.getState())
    }
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponse)
    }
    if (req.onSuccess) {
      req.onSuccess(transformedResponse)
    }
  }

  onInnerFailure = (req: RequestInterface<StateType, ResponseType, ErrorType>) => (error: ErrorType) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final error before transformation: ', error)
    }
    let transformedError = error
    if (req.transformErrorDataWithState) {
      transformedError = req.transformErrorDataWithState(error, this.getState())
    }
    if (this.printDebug) {
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

    if (this.printDebug) {
      console.log(`[NetJoyBase] Started req ${req.reqId} : ${req}`)
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
